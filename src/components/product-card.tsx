"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Plus } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/context/app";
import { money, num } from "@/lib/format";
import type { Product } from "@/lib/types";
import { Stars } from "@/components/stars";
import { cn } from "@/lib/utils";

export function ProductBadge({ p }: { p: Product }) {
  const { t } = useApp();
  if (!p.badge) return null;
  const styles = {
    sale: "bg-ys-tangerine text-white",
    new: "bg-ys-gold text-ys-ink",
    best: "bg-ys-deep text-white",
  } as const;
  const label = { sale: t.product.saleBadge, new: t.product.newBadge, best: t.product.bestBadge }[p.badge];
  return (
    <span
      className={cn(
        "absolute start-3 top-3 z-10 -rotate-3 rounded-md px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wide shadow-md",
        styles[p.badge]
      )}
    >
      {label}
    </span>
  );
}

export function ProductCard({ p, layout = "grid" }: { p: Product; layout?: "grid" | "list" }) {
  const { t, L, lang, addToCart, setCartOpen, toggleWishlist, inWishlist } = useApp();
  const wished = inWishlist(p.slug);
  const pct = p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;

  const add = () => {
    addToCart(p.slug);
    toast.success(`${L(p.name)} — ${t.product.added}`, {
      action: { label: t.nav.cart, onClick: () => setCartOpen(true) },
    });
  };

  const wish = () => {
    const added = toggleWishlist(p.slug);
    toast(added ? t.product.wishlistAdd : t.product.wishlistRemove);
  };

  if (layout === "list") {
    return (
      <motion.div
        layout
        className="group flex gap-4 rounded-2xl border border-border bg-white p-3 shadow-sm transition hover:shadow-md"
      >
        <Link href={`/product/${p.slug}`} className="relative block size-28 shrink-0 overflow-hidden rounded-xl sm:size-36">
          <ProductBadge p={p} />
          <Image src={p.img} alt={L(p.name)} fill sizes="144px" className="object-cover transition duration-500 group-hover:scale-105" />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col">
          <Link href={`/product/${p.slug}`} className="truncate font-semibold hover:text-ys-deep">{L(p.name)}</Link>
          <p className="mt-0.5 text-xs text-muted-foreground">{L(p.unit)}</p>
          <p className="mt-1 line-clamp-2 hidden text-sm text-muted-foreground sm:block">{L(p.desc)}</p>
          <div className="mt-auto flex items-end justify-between gap-2 pt-2">
            <div>
              <Stars rating={p.rating} />
              <p className="mt-1 text-lg font-extrabold text-ys-deep">
                {money(p.price, lang)}
                {p.oldPrice && (
                  <span className="ms-2 text-sm font-medium text-muted-foreground line-through">{money(p.oldPrice, lang)}</span>
                )}
              </p>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={wish}
                aria-label={t.nav.wishlist}
                className={cn(
                  "flex size-9 items-center justify-center rounded-full border transition",
                  wished ? "border-ys-tangerine bg-ys-tangerine/10 text-ys-tangerine" : "border-border bg-white text-muted-foreground hover:text-ys-tangerine"
                )}
              >
                <Heart className={cn("size-4", wished && "fill-current")} />
              </button>
              <button
                onClick={add}
                className="flex size-9 items-center justify-center rounded-full bg-ys-deep text-white transition hover:bg-ys-green"
                aria-label={t.product.addToCart}
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition hover:shadow-lg hover:shadow-ys-green/10"
    >
      <Link href={`/product/${p.slug}`} className="relative block aspect-square overflow-hidden bg-ys-mint/40">
        <ProductBadge p={p} />
        {pct > 0 && (
          <span className="absolute end-3 top-3 z-10 rounded-md bg-white/90 px-1.5 py-0.5 text-[11px] font-extrabold text-ys-tangerine shadow">
            -{num(pct, lang)}٪
          </span>
        )}
        <Image
          src={p.img}
          alt={L(p.name)}
          fill
          sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-108"
        />
      </Link>
      <button
        onClick={wish}
        aria-label={t.nav.wishlist}
        className={cn(
          "absolute end-3 top-12 z-10 flex size-8 items-center justify-center rounded-full bg-white/90 shadow transition-all",
          wished ? "text-ys-tangerine" : "text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-ys-tangerine",
          wished && "opacity-100"
        )}
      >
        <Heart className={cn("size-4", wished && "fill-current")} />
      </button>

      <div className="flex flex-1 flex-col gap-1 p-3.5">
        <div className="flex items-center justify-between gap-2">
          <Stars rating={p.rating} />
          <span className="text-[11px] text-muted-foreground">({num(p.reviews, lang)})</span>
        </div>
        <Link href={`/product/${p.slug}`} className="truncate text-sm font-semibold leading-snug hover:text-ys-deep">
          {L(p.name)}
        </Link>
        <p className="text-xs text-muted-foreground">{L(p.unit)}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <p className="text-base font-extrabold text-ys-deep">
            {money(p.price, lang)}
            {p.oldPrice && (
              <span className="ms-1.5 block text-xs font-medium text-muted-foreground line-through sm:inline">
                {money(p.oldPrice, lang)}
              </span>
            )}
          </p>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={add}
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ys-deep text-white shadow-md transition hover:bg-ys-green"
            aria-label={t.product.addToCart}
          >
            <Plus className="size-4.5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
