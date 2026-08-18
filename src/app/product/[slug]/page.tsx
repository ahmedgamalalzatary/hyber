"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Check, Heart, Minus, Plus, ShoppingBasket, Truck, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/context/app";
import { bySlug, products } from "@/data/products";
import { categories } from "@/data/categories";
import { money, num } from "@/lib/format";
import { ProductCard, ProductBadge } from "@/components/product-card";
import { Stars } from "@/components/stars";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const reviewers = [
  { en: "Ahmed M.", ar: "أحمد م." },
  { en: "Fatma K.", ar: "فاطمة ك." },
  { en: "Omar T.", ar: "عمر ت." },
  { en: "Mona S.", ar: "منى س." },
  { en: "Youssef H.", ar: "يوسف هـ." },
];
const reviewLines = [
  { en: "Exactly as described, and fresher than I expected.", ar: "زي الوصف بالظبط وأطزج مما توقعت." },
  { en: "Ordered twice this month. Quality is consistent.", ar: "طلبته مرتين الشهر ده. الجودة ثابتة." },
  { en: "Arrived fast and well packed.", ar: "وصل بسرعة ومتغلف كويس." },
  { en: "Good price for this quality.", ar: "سعر ممتاز مقابل الجودة دي." },
  { en: "The kids loved it — will buy again.", ar: "العيال حبوه — هشتريه تاني." },
];

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const p = bySlug.get(slug);
  const router = useRouter();
  const {
    t, L, lang, addToCart, setCartOpen, toggleWishlist, inWishlist, markViewed, recent, hydrated,
  } = useApp();
  const [qty, setQtyState] = useState(1);

  useEffect(() => {
    if (p) markViewed(p.slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const related = useMemo(
    () => products.filter((x) => x.cat === p?.cat && x.slug !== slug).slice(0, 4),
    [p, slug]
  );
  const recentProducts = useMemo(
    () => recent.filter((s) => s !== slug).map((s) => bySlug.get(s)).filter(Boolean).slice(0, 4),
    [recent, slug]
  );

  if (!p) return notFound();

  const cat = categories.find((c) => c.slug === p.cat);
  const wished = inWishlist(p.slug);
  const pct = p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;
  const lowStock = p.stock <= 15;

  const fakeReviews = Array.from({ length: 3 }, (_, i) => {
    const seed = (slug.length * 7 + i * 13) % reviewers.length;
    return {
      who: reviewers[seed],
      line: reviewLines[(seed + i) % reviewLines.length],
      stars: Math.max(4, Math.round(p.rating) - (i % 2)),
    };
  });

  const add = () => {
    addToCart(p.slug, qty);
    toast.success(`${L(p.name)} × ${num(qty, lang)} — ${t.product.added}`, {
      action: { label: t.nav.cart, onClick: () => setCartOpen(true) },
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-ys-deep">{t.nav.home}</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-ys-deep">{t.nav.shop}</Link>
        <span>/</span>
        {cat && (
          <>
            <Link href={`/shop?cat=${cat.slug}`} className="hover:text-ys-deep">{L(cat.name)}</Link>
            <span>/</span>
          </>
        )}
        <span className="font-semibold text-ys-ink">{L(p.name)}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
          <ProductBadge p={p} />
          {pct > 0 && (
            <span className="absolute end-4 top-4 z-10 rounded-lg bg-ys-tangerine px-2.5 py-1 text-sm font-extrabold text-white shadow">
              -{num(pct, lang)}٪ {t.product.off}
            </span>
          )}
          <Image
            src={p.img}
            alt={L(p.name)}
            fill
            priority
            sizes="(max-width:1024px) 100vw, 50vw"
            className="object-cover transition duration-700 hover:scale-110"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <h1 className="font-display text-3xl text-ys-ink sm:text-4xl">{L(p.name)}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <Stars rating={p.rating} />
            <span className="font-semibold">{p.rating}</span>
            <span className="text-muted-foreground">
              ({num(p.reviews, lang)} {t.product.reviews})
            </span>
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold",
                lowStock ? "bg-ys-tangerine/10 text-ys-tangerine" : "bg-ys-green/10 text-ys-deep"
              )}
            >
              <Check className="size-3.5" />
              {lowStock ? t.product.lowStock.replace("{n}", num(p.stock, lang)) : t.product.inStock}
            </span>
          </div>

          <p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">{L(p.desc)}</p>

          <div className="mt-6 flex items-end gap-3">
            <p className="font-display text-4xl text-ys-deep">{money(p.price, lang)}</p>
            {p.oldPrice && (
              <p className="pb-1 text-lg text-muted-foreground line-through">{money(p.oldPrice, lang)}</p>
            )}
            <p className="pb-1 text-sm text-muted-foreground">/ {L(p.unit)}</p>
          </div>

          {/* Qty + actions */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 rounded-full border border-border bg-white p-1">
              <button
                onClick={() => setQtyState((n) => Math.max(1, n - 1))}
                className="flex size-10 items-center justify-center rounded-full transition hover:bg-ys-mint"
                aria-label="-"
              >
                <Minus className="size-4" />
              </button>
              <span className="min-w-8 text-center text-lg font-bold tabular-nums">{num(qty, lang)}</span>
              <button
                onClick={() => setQtyState((n) => n + 1)}
                className="flex size-10 items-center justify-center rounded-full transition hover:bg-ys-mint"
                aria-label="+"
              >
                <Plus className="size-4" />
              </button>
            </div>
            <Button
              onClick={add}
              size="lg"
              className="h-12 flex-1 rounded-full bg-ys-deep px-8 text-base font-bold text-white hover:bg-ys-green sm:flex-none"
            >
              <ShoppingBasket className="size-5" />
              {t.product.addToCart}
            </Button>
            <Button
              onClick={() => { addToCart(p.slug, qty); router.push("/checkout"); }}
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-ys-tangerine/50 px-8 text-base font-bold text-ys-tangerine hover:bg-ys-tangerine hover:text-white"
            >
              {t.product.buyNow}
            </Button>
            <button
              onClick={() => {
                const added = toggleWishlist(p.slug);
                toast(added ? t.product.wishlistAdd : t.product.wishlistRemove);
              }}
              aria-label={t.nav.wishlist}
              className={cn(
                "flex size-12 items-center justify-center rounded-full border transition",
                wished
                  ? "border-ys-tangerine bg-ys-tangerine/10 text-ys-tangerine"
                  : "border-border bg-white text-muted-foreground hover:text-ys-tangerine"
              )}
            >
              <Heart className={cn("size-5", wished && "fill-current")} />
            </button>
          </div>

          {/* Trust chips */}
          <div className="mt-7 grid grid-cols-2 gap-2.5 text-xs font-semibold text-ys-ink/80">
            <span className="flex items-center gap-2 rounded-xl bg-ys-mint/70 px-3.5 py-3">
              <Truck className="size-4 text-ys-deep" /> {t.marquee[0]}
            </span>
            <span className="flex items-center gap-2 rounded-xl bg-ys-mint/70 px-3.5 py-3">
              <Undo2 className="size-4 text-ys-deep" /> {t.about.values[0].t}
            </span>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="desc" className="mt-8">
            <TabsList className="w-full justify-start rounded-full bg-ys-mint/70 p-1">
              <TabsTrigger value="desc" className="flex-1 rounded-full">{t.product.description}</TabsTrigger>
              <TabsTrigger value="details" className="flex-1 rounded-full">{t.product.details}</TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1 rounded-full">{t.product.reviews}</TabsTrigger>
            </TabsList>
            <TabsContent value="desc" className="mt-4 rounded-2xl border border-border bg-white p-5 text-sm leading-relaxed text-muted-foreground">
              {L(p.desc)}
            </TabsContent>
            <TabsContent value="details" className="mt-4 overflow-hidden rounded-2xl border border-border bg-white text-sm">
              {[
                [t.product.category, cat ? L(cat.name) : "—"],
                [t.product.unit, L(p.unit)],
                [t.product.rating, `${p.rating} / 5`],
                [t.product.availability, `${num(p.stock, lang)}`],
              ].map(([k, v], i) => (
                <div key={i} className={cn("flex justify-between px-5 py-3", i % 2 === 0 && "bg-ys-paper/60")}>
                  <span className="font-semibold">{k}</span>
                  <span className="text-muted-foreground">{v}</span>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="reviews" className="mt-4 space-y-3">
              {fakeReviews.map((r, i) => (
                <div key={i} className="rounded-2xl border border-border bg-white p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold">{L(r.who)}</p>
                    <Stars rating={r.stars} />
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">{L(r.line)}</p>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl text-ys-ink sm:text-3xl">{t.product.related}</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {related.map((x) => <ProductCard key={x.slug} p={x} />)}
          </div>
        </section>
      )}

      {/* Recently viewed */}
      {hydrated && recentProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl text-ys-ink sm:text-3xl">{t.product.recentlyViewed}</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {recentProducts.map((x) => x && <ProductCard key={x.slug} p={x} />)}
          </div>
        </section>
      )}
    </div>
  );
}
