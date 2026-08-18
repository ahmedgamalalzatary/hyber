"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { dict, type Dict } from "@/lib/i18n";
import { bySlug } from "@/data/products";
import type { Address, CartItem, Lang, Localized, Order } from "@/lib/types";

const LS = {
  lang: "ys-lang",
  cart: "ys-cart",
  wishlist: "ys-wishlist",
  orders: "ys-orders",
  recent: "ys-recent",
  profile: "ys-profile",
} as const;

export const PROMOS: Record<string, { pct: number; min: number }> = {
  WELCOME10: { pct: 10, min: 0 },
  YS20: { pct: 20, min: 500 },
};

export const FREE_DELIVERY_AT = 500;
export const DELIVERY_FEE = 40;

type Profile = { name: string; phone: string; city: string; street: string; email: string };

type AppState = {
  lang: Lang;
  dir: "ltr" | "rtl";
  t: Dict;
  L: (v: Localized) => string;
  toggleLang: () => void;

  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  removeFromCart: (slug: string) => void;
  clearCart: () => void;

  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;

  wishlist: string[];
  toggleWishlist: (slug: string) => boolean; // returns true when added
  inWishlist: (slug: string) => boolean;

  promo: string | null;
  applyPromo: (code: string) => boolean;
  clearPromo: () => void;
  discount: number;
  deliveryFee: number;

  orders: Order[];
  placeOrder: (address: Address, slot: string, payment: "cod" | "card", rush: number) => Order;

  recent: string[];
  markViewed: (slug: string) => void;

  profile: Profile;
  saveProfile: (p: Profile) => void;

  hydrated: boolean;
};

const Ctx = createContext<AppState | null>(null);

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked — demo data, safe to ignore */
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [promo, setPromo] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [profile, setProfile] = useState<Profile>({ name: "", phone: "", city: "", street: "", email: "" });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLang(load<Lang>(LS.lang, "ar"));
    setCart(load(LS.cart, []));
    setWishlist(load(LS.wishlist, []));
    setOrders(load(LS.orders, []));
    setRecent(load(LS.recent, []));
    setProfile(load(LS.profile, { name: "", phone: "", city: "", street: "", email: "" }));
    setHydrated(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    if (hydrated) save(LS.lang, lang);
  }, [lang, hydrated]);

  useEffect(() => { if (hydrated) save(LS.cart, cart); }, [cart, hydrated]);
  useEffect(() => { if (hydrated) save(LS.wishlist, wishlist); }, [wishlist, hydrated]);
  useEffect(() => { if (hydrated) save(LS.orders, orders); }, [orders, hydrated]);
  useEffect(() => { if (hydrated) save(LS.recent, recent); }, [recent, hydrated]);

  const toggleLang = useCallback(() => setLang((l) => (l === "ar" ? "en" : "ar")), []);
  const L = useCallback((v: Localized) => v[lang], [lang]);

  const addToCart = useCallback((slug: string, qty = 1) => {
    setCart((c) => {
      const found = c.find((i) => i.slug === slug);
      if (found) return c.map((i) => (i.slug === slug ? { ...i, qty: i.qty + qty } : i));
      return [...c, { slug, qty }];
    });
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setCart((c) =>
      qty <= 0 ? c.filter((i) => i.slug !== slug) : c.map((i) => (i.slug === slug ? { ...i, qty } : i))
    );
  }, []);

  const removeFromCart = useCallback((slug: string) => {
    setCart((c) => c.filter((i) => i.slug !== slug));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setPromo(null);
  }, []);

  const toggleWishlist = useCallback((slug: string) => {
    let added = false;
    setWishlist((w) => {
      if (w.includes(slug)) return w.filter((s) => s !== slug);
      added = true;
      return [...w, slug];
    });
    return added;
  }, []);

  const inWishlist = useCallback((slug: string) => wishlist.includes(slug), [wishlist]);

  const cartSubtotal = useMemo(
    () => cart.reduce((sum, i) => sum + (bySlug.get(i.slug)?.price ?? 0) * i.qty, 0),
    [cart]
  );
  const cartCount = useMemo(() => cart.reduce((n, i) => n + i.qty, 0), [cart]);

  const discount = useMemo(() => {
    if (!promo) return 0;
    const p = PROMOS[promo];
    if (!p || cartSubtotal < p.min) return 0;
    return Math.round((cartSubtotal * p.pct) / 100);
  }, [promo, cartSubtotal]);

  const deliveryFee = cartSubtotal - discount >= FREE_DELIVERY_AT || cart.length === 0 ? 0 : DELIVERY_FEE;

  const applyPromo = useCallback(
    (code: string) => {
      const key = code.trim().toUpperCase();
      const p = PROMOS[key];
      if (!p || cartSubtotal < p.min) return false;
      setPromo(key);
      return true;
    },
    [cartSubtotal]
  );

  const clearPromo = useCallback(() => setPromo(null), []);

  const placeOrder = useCallback(
    (address: Address, slot: string, payment: "cod" | "card", rush: number) => {
      const items = cart.map((i) => ({ slug: i.slug, qty: i.qty, price: bySlug.get(i.slug)?.price ?? 0 }));
      const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
      const disc = promo && PROMOS[promo] && subtotal >= PROMOS[promo].min
        ? Math.round((subtotal * PROMOS[promo].pct) / 100)
        : 0;
      const delivery = (subtotal - disc >= FREE_DELIVERY_AT ? 0 : DELIVERY_FEE) + rush;
      const order: Order = {
        id: `YS-${Date.now().toString(36).toUpperCase()}`,
        date: new Date().toISOString(),
        items,
        subtotal,
        discount: disc,
        delivery,
        total: subtotal - disc + delivery,
        promo: promo ?? undefined,
        address,
        slot,
        payment,
        status: "confirmed",
      };
      setOrders((o) => [order, ...o]);
      setCart([]);
      setPromo(null);
      return order;
    },
    [cart, promo]
  );

  const markViewed = useCallback((slug: string) => {
    setRecent((r) => [slug, ...r.filter((s) => s !== slug)].slice(0, 8));
  }, []);

  const saveProfile = useCallback((p: Profile) => {
    setProfile(p);
    save(LS.profile, p);
  }, []);

  const value: AppState = {
    lang,
    dir: lang === "ar" ? "rtl" : "ltr",
    t: dict[lang],
    L,
    toggleLang,
    cart,
    cartCount,
    cartSubtotal,
    addToCart,
    setQty,
    removeFromCart,
    clearCart,
    cartOpen,
    setCartOpen,
    wishlist,
    toggleWishlist,
    inWishlist,
    promo,
    applyPromo,
    clearPromo,
    discount,
    deliveryFee,
    orders,
    placeOrder,
    recent,
    markViewed,
    profile,
    saveProfile,
    hydrated,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
