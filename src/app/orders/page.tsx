"use client";

import Image from "next/image";
import Link from "next/link";
import { PackageOpen } from "lucide-react";
import { useApp } from "@/context/app";
import { bySlug } from "@/data/products";
import { fmtDate, money, num } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function OrdersPage() {
  const { t, L, lang, orders, hydrated } = useApp();

  if (hydrated && orders.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-28 text-center">
        <PackageOpen className="size-14 text-muted-foreground/40" />
        <h1 className="font-display mt-5 text-3xl text-ys-ink">{t.orders.empty}</h1>
        <p className="mt-2 text-muted-foreground">{t.orders.emptySub}</p>
        <Button asChild size="lg" className="mt-7 rounded-full bg-ys-deep px-8 text-white hover:bg-ys-green">
          <Link href="/shop">{t.cart.goShopping}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display text-3xl text-ys-ink sm:text-4xl">{t.orders.title}</h1>
      <div className="mt-8 space-y-4">
        {orders.map((o) => (
          <Link
            key={o.id}
            href={`/order/${o.id}`}
            className="block rounded-3xl border border-border bg-white p-5 shadow-sm transition hover:border-ys-green/50 hover:shadow-md"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-sm font-bold text-ys-deep">{o.id}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{fmtDate(o.date, lang)}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="rounded-full bg-ys-gold/20 text-ys-ink">{t.order.statusPreparing}</Badge>
                <p className="text-lg font-extrabold text-ys-deep">{money(o.total, lang)}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              {o.items.slice(0, 6).map((i) => {
                const p = bySlug.get(i.slug);
                return p ? (
                  <span key={i.slug} className="relative size-11 overflow-hidden rounded-lg border border-border">
                    <Image src={p.img} alt={L(p.name)} fill sizes="44px" className="object-cover" />
                  </span>
                ) : null;
              })}
              {o.items.length > 6 && (
                <span className="text-xs font-semibold text-muted-foreground">
                  +{num(o.items.length - 6, lang)}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
