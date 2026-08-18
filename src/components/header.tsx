"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Globe, Heart, Menu, Phone, Search, ShoppingBasket, Truck, User } from "lucide-react";
import { useApp } from "@/context/app";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { money } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const { t, L, lang, toggleLang, cartCount, wishlist, setCartOpen, dir } = useApp();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (needle.length < 2) return [];
    return products
      .filter(
        (p) =>
          p.name.en.toLowerCase().includes(needle) ||
          p.name.ar.includes(needle) ||
          p.slug.includes(needle)
      )
      .slice(0, 6);
  }, [q]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const submitSearch = () => {
    if (!q.trim()) return;
    setFocused(false);
    router.push(`/shop?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Top strip */}
      <div className="bg-ys-ink text-ys-paper text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5">
          <p className="flex items-center gap-1.5 truncate">
            <Truck className="size-3.5 shrink-0 text-ys-bright" />
            <span className="truncate">{t.topbar.delivery}</span>
          </p>
          <div className="flex shrink-0 items-center gap-4">
            <span className="hidden items-center gap-1.5 sm:flex">
              <Phone className="size-3.5 text-ys-bright" />
              {t.topbar.hotline}
            </span>
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 font-semibold transition hover:bg-white/20"
            >
              <Globe className="size-3.5" />
              {t.topbar.switch}
            </button>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-border/60 bg-ys-paper/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-2.5 px-4 py-3 sm:flex-nowrap sm:gap-x-6">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label={t.common.menu}>
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side={dir === "rtl" ? "right" : "left"} className="w-80 bg-ys-paper">
              <SheetHeader>
                <SheetTitle className="font-display text-ys-deep">{t.brandAr}</SheetTitle>
              </SheetHeader>
              <nav className="mt-2 grid gap-1 px-4 pb-6">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/shop?cat=${c.slug}`}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-ys-mint"
                  >
                    {L(c.name)}
                  </Link>
                ))}
                <div className="my-2 h-px bg-border" />
                <Link href="/about" className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-ys-mint">
                  {t.nav.about}
                </Link>
                <Link href="/orders" className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-ys-mint">
                  {t.nav.orders}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <Image
              src="/logo.png"
              alt={t.brand}
              width={46}
              height={46}
              className="rounded-full ring-2 ring-ys-green/30"
              priority
            />
            <span className="flex flex-col leading-tight sm:flex">
              <span className="font-display text-lg text-ys-deep">{t.brand}</span>
              <span className="text-[11px] font-medium tracking-wide text-muted-foreground">
                {lang === "ar" ? "AWLAD EL SHIKH" : "أسواق أولاد الشيخ"}
              </span>
            </span>
          </Link>

          {/* Search — full row on mobile, inline on sm+ */}
          <div ref={boxRef} className="relative order-last w-full min-w-0 sm:order-none sm:w-auto sm:flex-1">
            <div className="flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 shadow-sm transition focus-within:border-ys-green focus-within:ring-2 focus-within:ring-ys-green/20">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onFocus={() => setFocused(true)}
                onKeyDown={(e) => e.key === "Enter" && submitSearch()}
                placeholder={t.search.placeholder}
                className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
              />
            </div>
            {focused && q.trim().length >= 2 && (
              <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-border bg-white shadow-xl">
                {suggestions.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-muted-foreground">
                    {t.search.noResults} “{q}”
                  </p>
                ) : (
                  <>
                    {suggestions.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/product/${p.slug}`}
                        onClick={() => setFocused(false)}
                        className="flex items-center gap-3 px-3 py-2 transition hover:bg-ys-mint/60"
                      >
                        <Image
                          src={p.img}
                          alt={L(p.name)}
                          width={40}
                          height={40}
                          className="size-10 rounded-lg object-cover"
                        />
                        <span className="min-w-0 flex-1 truncate text-sm font-medium">{L(p.name)}</span>
                        <span className="shrink-0 text-sm font-bold text-ys-deep">{money(p.price, lang)}</span>
                      </Link>
                    ))}
                    <button
                      onClick={submitSearch}
                      className="w-full border-t border-border px-4 py-2.5 text-start text-sm font-semibold text-ys-green transition hover:bg-ys-mint/60"
                    >
                      {t.search.viewAll} ←
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="ms-auto flex shrink-0 items-center gap-0.5 sm:ms-0 sm:gap-1.5">
            <Button asChild variant="ghost" size="icon" className="relative" aria-label={t.nav.account}>
              <Link href="/account">
                <User className="size-5" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon" className="relative" aria-label={t.nav.wishlist}>
              <Link href="/wishlist">
                <Heart className="size-5" />
                {wishlist.length > 0 && (
                  <Badge className="absolute -end-0.5 -top-0.5 size-4 justify-center rounded-full bg-ys-tangerine p-0 text-[10px] text-white">
                    {wishlist.length}
                  </Badge>
                )}
              </Link>
            </Button>
            <Button
              onClick={() => setCartOpen(true)}
              className="relative gap-2 rounded-full bg-ys-deep px-4 text-white hover:bg-ys-green"
              aria-label={t.nav.cart}
            >
              <ShoppingBasket className="size-5" />
              <span className="hidden sm:inline">{t.nav.cart}</span>
              {cartCount > 0 && (
                <Badge className="absolute -end-1 -top-1.5 size-5 justify-center rounded-full bg-ys-tangerine p-0 text-[11px] font-bold text-white">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Category nav */}
        <nav className="no-scrollbar mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 pb-2.5">
          <Link
            href="/shop"
            className="shrink-0 rounded-full bg-ys-deep px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-ys-green"
          >
            {t.shop.all}
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/shop?cat=${c.slug}`}
              className="shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold text-ys-ink/80 transition hover:bg-ys-mint hover:text-ys-deep"
            >
              {L(c.name)}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
