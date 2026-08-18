"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, TicketPercent, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useApp, FREE_DELIVERY_AT } from "@/context/app";
import { bySlug } from "@/data/products";
import { money, num } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

export default function CartPage() {
  const {
    t, L, lang, cart, setQty, removeFromCart, cartSubtotal, discount, deliveryFee,
    promo, applyPromo, clearPromo, hydrated,
  } = useApp();
  const [code, setCode] = useState("");

  const total = cartSubtotal - discount + deliveryFee;
  const left = Math.max(0, FREE_DELIVERY_AT - cartSubtotal);

  if (hydrated && cart.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-28 text-center">
        <span className="text-6xl">🧺</span>
        <h1 className="font-display mt-5 text-3xl text-ys-ink">{t.cart.empty}</h1>
        <p className="mt-2 text-muted-foreground">{t.cart.emptySub}</p>
        <Button asChild size="lg" className="mt-7 rounded-full bg-ys-deep px-8 text-white hover:bg-ys-green">
          <Link href="/shop">{t.cart.goShopping}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display text-3xl text-ys-ink sm:text-4xl">{t.cart.title}</h1>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {cart.map((item) => {
            const p = bySlug.get(item.slug);
            if (!p) return null;
            return (
              <div key={item.slug} className="flex items-center gap-4 rounded-2xl border border-border bg-white p-3.5 shadow-sm">
                <Link href={`/product/${p.slug}`} className="relative size-20 shrink-0 overflow-hidden rounded-xl sm:size-24">
                  <Image src={p.img} alt={L(p.name)} fill sizes="96px" className="object-cover" />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={`/product/${p.slug}`} className="block truncate font-semibold hover:text-ys-deep">
                    {L(p.name)}
                  </Link>
                  <p className="text-xs text-muted-foreground">{L(p.unit)} · {money(p.price, lang)}</p>
                  <div className="mt-2.5 flex items-center gap-1 rounded-full border border-border bg-ys-paper px-1 py-0.5 w-fit">
                    <button onClick={() => setQty(item.slug, item.qty - 1)} className="flex size-7 items-center justify-center rounded-full transition hover:bg-ys-mint" aria-label="-">
                      <Minus className="size-3.5" />
                    </button>
                    <span className="min-w-6 text-center font-bold tabular-nums">{num(item.qty, lang)}</span>
                    <button onClick={() => setQty(item.slug, item.qty + 1)} className="flex size-7 items-center justify-center rounded-full transition hover:bg-ys-mint" aria-label="+">
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <button onClick={() => removeFromCart(item.slug)} className="text-muted-foreground transition hover:text-destructive" aria-label={t.cart.remove}>
                    <Trash2 className="size-4.5" />
                  </button>
                  <p className="text-lg font-extrabold text-ys-deep">{money(p.price * item.qty, lang)}</p>
                </div>
              </div>
            );
          })}
          <Button asChild variant="ghost" className="rounded-full text-ys-deep">
            <Link href="/shop">← {t.cart.continueShopping}</Link>
          </Button>
        </div>

        {/* Summary */}
        <aside className="sticky top-40 rounded-3xl border border-border bg-white p-6 shadow-sm">
          <h2 className="font-display text-xl text-ys-ink">{t.cart.summary}</h2>

          <div className="mt-4 rounded-xl bg-ys-mint/50 p-3">
            <p className="mb-2 text-xs font-semibold text-ys-deep">
              {left > 0 ? t.cart.freeDeliveryLeft.replace("{n}", num(left, lang)) : t.cart.freeDeliveryHit}
            </p>
            <Progress value={Math.min(100, (cartSubtotal / FREE_DELIVERY_AT) * 100)} className="h-2 bg-white" />
          </div>

          {/* Promo */}
          <div className="mt-5">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <TicketPercent className="size-4" /> {t.cart.promo}
            </p>
            {promo ? (
              <div className="flex items-center justify-between rounded-xl border border-ys-green/40 bg-ys-green/10 px-3.5 py-2.5">
                <span className="font-mono text-sm font-bold text-ys-deep">{promo}</span>
                <button onClick={clearPromo} className="text-xs font-semibold text-muted-foreground hover:text-destructive">
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="WELCOME10"
                  className="rounded-full bg-ys-paper font-mono uppercase"
                />
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => {
                    if (applyPromo(code)) {
                      toast.success(t.cart.promoApplied);
                      setCode("");
                    } else toast.error(t.cart.promoInvalid);
                  }}
                >
                  {t.cart.promoApply}
                </Button>
              </div>
            )}
          </div>

          <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>{t.cart.subtotal}</span><span>{money(cartSubtotal, lang)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between font-semibold text-ys-green">
                <span>{t.cart.discount}</span><span>-{money(discount, lang)}</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>{t.cart.deliveryFee}</span>
              <span>{deliveryFee === 0 ? t.cart.free : money(deliveryFee, lang)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-lg font-extrabold text-ys-ink">
              <span>{t.cart.grandTotal}</span><span>{money(total, lang)}</span>
            </div>
          </div>

          <Button asChild size="lg" className="mt-6 h-12 w-full rounded-full bg-ys-deep text-base font-bold text-white hover:bg-ys-green">
            <Link href="/checkout">{t.cart.checkout}</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}
