"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBasket, Trash2 } from "lucide-react";
import { useApp, FREE_DELIVERY_AT } from "@/context/app";
import { bySlug } from "@/data/products";
import { money, num } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function CartDrawer() {
  const {
    t, L, lang, dir, cart, cartOpen, setCartOpen, setQty, removeFromCart,
    cartSubtotal, discount, deliveryFee,
  } = useApp();

  const total = cartSubtotal - discount + deliveryFee;
  const progress = Math.min(100, (cartSubtotal / FREE_DELIVERY_AT) * 100);
  const left = Math.max(0, FREE_DELIVERY_AT - cartSubtotal);

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent side={dir === "rtl" ? "left" : "right"} className="flex w-full flex-col bg-ys-paper sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 font-display text-ys-deep">
            <ShoppingBasket className="size-5" />
            {t.cart.title}
          </SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="text-5xl">🧺</span>
            <p className="font-display text-xl text-ys-deep">{t.cart.empty}</p>
            <p className="text-sm text-muted-foreground">{t.cart.emptySub}</p>
            <Button
              onClick={() => setCartOpen(false)}
              asChild
              className="mt-2 rounded-full bg-ys-deep text-white hover:bg-ys-green"
            >
              <Link href="/shop">{t.cart.goShopping}</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="px-4">
              <div className="rounded-xl bg-white p-3 shadow-sm">
                <p className="mb-2 text-xs font-semibold text-ys-deep">
                  {left > 0
                    ? t.cart.freeDeliveryLeft.replace("{n}", num(left, lang))
                    : t.cart.freeDeliveryHit}
                </p>
                <Progress value={progress} className="h-2 bg-ys-mint" />
              </div>
            </div>

            <div className="flex-1 space-y-2.5 overflow-y-auto px-4 py-3">
              {cart.map((item) => {
                const p = bySlug.get(item.slug);
                if (!p) return null;
                return (
                  <div key={item.slug} className="flex items-center gap-3 rounded-xl bg-white p-2.5 shadow-sm">
                    <Link href={`/product/${p.slug}`} onClick={() => setCartOpen(false)} className="relative size-16 shrink-0 overflow-hidden rounded-lg">
                      <Image src={p.img} alt={L(p.name)} fill sizes="64px" className="object-cover" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{L(p.name)}</p>
                      <p className="text-xs text-muted-foreground">{L(p.unit)}</p>
                      <p className="mt-0.5 text-sm font-bold text-ys-deep">{money(p.price * item.qty, lang)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <button
                        onClick={() => removeFromCart(item.slug)}
                        className="text-muted-foreground transition hover:text-destructive"
                        aria-label={t.cart.remove}
                      >
                        <Trash2 className="size-4" />
                      </button>
                      <div className="flex items-center gap-1 rounded-full border border-border bg-ys-paper px-1 py-0.5">
                        <button onClick={() => setQty(item.slug, item.qty - 1)} className="flex size-6 items-center justify-center rounded-full transition hover:bg-ys-mint" aria-label="-">
                          <Minus className="size-3" />
                        </button>
                        <span className="min-w-5 text-center text-sm font-bold tabular-nums">{num(item.qty, lang)}</span>
                        <button onClick={() => setQty(item.slug, item.qty + 1)} className="flex size-6 items-center justify-center rounded-full transition hover:bg-ys-mint" aria-label="+">
                          <Plus className="size-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <SheetFooter className="border-t border-border bg-white">
              <div className="w-full space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>{t.cart.subtotal}</span><span>{money(cartSubtotal, lang)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between font-medium text-ys-green">
                    <span>{t.cart.discount}</span><span>-{money(discount, lang)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>{t.cart.deliveryFee}</span>
                  <span>{deliveryFee === 0 ? t.cart.free : money(deliveryFee, lang)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-base font-extrabold text-ys-ink">
                  <span>{t.cart.grandTotal}</span><span>{money(total, lang)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button asChild variant="outline" className="rounded-full" onClick={() => setCartOpen(false)}>
                    <Link href="/cart">{t.cart.title}</Link>
                  </Button>
                  <Button asChild className="rounded-full bg-ys-deep text-white hover:bg-ys-green" onClick={() => setCartOpen(false)}>
                    <Link href="/checkout">{t.cart.checkout}</Link>
                  </Button>
                </div>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
