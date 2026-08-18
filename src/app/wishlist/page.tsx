"use client";

import Link from "next/link";
import { Heart, ShoppingBasket } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/context/app";
import { bySlug } from "@/data/products";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const { t, wishlist, addToCart, setCartOpen, hydrated } = useApp();
  const items = wishlist.map((s) => bySlug.get(s)).filter((p) => p != null);

  if (hydrated && items.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-28 text-center">
        <Heart className="size-14 text-muted-foreground/40" />
        <h1 className="font-display mt-5 text-3xl text-ys-ink">{t.wishlist.empty}</h1>
        <p className="mt-2 text-muted-foreground">{t.wishlist.emptySub}</p>
        <Button asChild size="lg" className="mt-7 rounded-full bg-ys-deep px-8 text-white hover:bg-ys-green">
          <Link href="/shop">{t.cart.goShopping}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-ys-ink sm:text-4xl">{t.wishlist.title}</h1>
        {items.length > 0 && (
          <Button
            onClick={() => {
              items.forEach((p) => addToCart(p.slug));
              toast.success(t.product.added);
              setCartOpen(true);
            }}
            className="rounded-full bg-ys-deep text-white hover:bg-ys-green"
          >
            <ShoppingBasket className="size-4.5" />
            {t.wishlist.addAll}
          </Button>
        )}
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.slug} p={p} />
        ))}
      </div>
    </div>
  );
}
