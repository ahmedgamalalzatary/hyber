"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check, PackageCheck, Truck, Home } from "lucide-react";
import { useApp } from "@/context/app";
import { bySlug } from "@/data/products";
import { fmtDate, money, num } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function OrderPage() {
  const { id } = useParams<{ id: string }>();
  const { t, L, lang, orders, hydrated } = useApp();

  if (!hydrated) return <div className="py-40 text-center text-muted-foreground">{t.common.loading}</div>;

  const order = orders.find((o) => o.id === id);
  if (!order) return notFound();

  const statusSteps = [
    { icon: Check, label: t.order.statusConfirmed },
    { icon: PackageCheck, label: t.order.statusPreparing },
    { icon: Truck, label: t.order.statusWay },
    { icon: Home, label: t.order.statusDelivered },
  ];
  const activeIdx = 1; // demo: freshly placed orders are "being packed"

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
          className="mx-auto flex size-20 items-center justify-center rounded-full bg-ys-green shadow-lg shadow-ys-green/30"
        >
          <Check className="size-10 text-white" strokeWidth={3} />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="font-display mt-6 text-3xl text-ys-ink sm:text-4xl"
        >
          {t.order.confirmed}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-2 text-muted-foreground"
        >
          {t.order.thanks.replace("{name}", order.address.name.split(" ")[0])}
        </motion.p>
        <p className="mt-3 inline-block rounded-full bg-ys-mint px-4 py-1 font-mono text-sm font-bold text-ys-deep">
          {t.order.number} {order.id}
        </p>
      </div>

      {/* Status */}
      <div className="mt-10 rounded-3xl border border-border bg-white p-6">
        <h2 className="font-display mb-6 text-lg text-ys-ink">{t.order.track}</h2>
        <div className="flex items-start justify-between">
          {statusSteps.map((s, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2 text-center">
              <div className="flex w-full items-center">
                <span className={cn("h-0.5 flex-1", i === 0 ? "bg-transparent" : i <= activeIdx ? "bg-ys-green" : "bg-ys-mint")} />
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-full transition",
                    i <= activeIdx ? "bg-ys-green text-white" : "bg-ys-mint text-ys-deep/50"
                  )}
                >
                  <s.icon className="size-4.5" />
                </span>
                <span className={cn("h-0.5 flex-1", i === statusSteps.length - 1 ? "bg-transparent" : i < activeIdx ? "bg-ys-green" : "bg-ys-mint")} />
              </div>
              <span className={cn("text-[11px] font-semibold sm:text-xs", i <= activeIdx ? "text-ys-deep" : "text-muted-foreground")}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-white">
        <div className="flex items-center justify-between border-b border-border bg-ys-paper/60 px-5 py-3 text-xs font-semibold text-muted-foreground">
          <span>{t.order.placedOn} {fmtDate(order.date, lang)}</span>
          <span>{t.order.itemsCount.replace("{n}", num(order.items.length, lang))}</span>
        </div>
        {order.items.map((i) => {
          const p = bySlug.get(i.slug);
          if (!p) return null;
          return (
            <div key={i.slug} className="flex items-center gap-3 border-b border-border/60 px-5 py-3 last:border-0">
              <span className="relative size-12 shrink-0 overflow-hidden rounded-lg">
                <Image src={p.img} alt={L(p.name)} fill sizes="48px" className="object-cover" />
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{L(p.name)}</span>
              <span className="text-xs text-muted-foreground">×{num(i.qty, lang)}</span>
              <span className="w-24 text-end text-sm font-bold text-ys-deep">{money(i.price * i.qty, lang)}</span>
            </div>
          );
        })}
        <div className="space-y-1.5 bg-ys-paper/60 px-5 py-4 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>{t.cart.subtotal}</span><span>{money(order.subtotal, lang)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between font-semibold text-ys-green">
              <span>{t.cart.discount} ({order.promo})</span><span>-{money(order.discount, lang)}</span>
            </div>
          )}
          <div className="flex justify-between text-muted-foreground">
            <span>{t.cart.deliveryFee}</span>
            <span>{order.delivery === 0 ? t.cart.free : money(order.delivery, lang)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 text-base font-extrabold text-ys-ink">
            <span>{t.cart.grandTotal}</span><span>{money(order.total, lang)}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/orders">{t.order.viewOrders}</Link>
        </Button>
        <Button asChild className="rounded-full bg-ys-deep px-7 text-white hover:bg-ys-green">
          <Link href="/">{t.order.backHome}</Link>
        </Button>
      </div>
    </div>
  );
}
