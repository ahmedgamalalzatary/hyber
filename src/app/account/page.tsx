"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CircleUserRound, Heart, MapPin, Package, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/context/app";
import { num } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AccountPage() {
  const { t, lang, profile, saveProfile, orders, wishlist, hydrated } = useApp();
  const [form, setForm] = useState(profile);

  useEffect(() => setForm(profile), [profile]);

  const points = Math.floor(orders.reduce((s, o) => s + o.total, 0) / 10);
  const field = "h-11 rounded-xl bg-white";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-3xl text-ys-ink sm:text-4xl">{t.account.title}</h1>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_320px]">
        {/* Profile form */}
        <div className="rounded-3xl border border-border bg-ys-mint/30 p-6">
          <p className="flex items-center gap-2 font-bold text-ys-deep">
            <CircleUserRound className="size-5" /> {t.account.profile}
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label>{t.checkout.name}</Label>
              <Input className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid gap-1.5">
              <Label>{t.checkout.phone}</Label>
              <Input className={field} dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="grid gap-1.5">
              <Label>{t.account.email}</Label>
              <Input className={field} dir="ltr" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="grid gap-1.5">
              <Label>{t.checkout.city}</Label>
              <Input className={field} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <div className="grid gap-1.5 sm:col-span-2">
              <Label>{t.checkout.street}</Label>
              <Input className={field} value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} />
            </div>
          </div>
          <Button
            onClick={() => { saveProfile(form); toast.success(t.account.saved); }}
            className="mt-6 rounded-full bg-ys-deep px-8 text-white hover:bg-ys-green"
          >
            {t.account.save}
          </Button>
        </div>

        <div className="space-y-5">
          {/* Loyalty card */}
          <div className="ys-grain relative overflow-hidden rounded-3xl bg-ys-ink p-6 text-white shadow-lg">
            <div aria-hidden className="absolute -end-10 -top-16 size-44 rotate-[24deg] rounded-3xl bg-ys-green/25" />
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-ys-bright">
              <Sparkles className="size-4" /> {t.club.title}
            </p>
            <p className="font-display mt-4 text-4xl">{hydrated ? num(points, lang) : "—"}</p>
            <p className="text-sm text-white/60">{t.club.points}</p>
            <div className="mt-5 flex items-center justify-between text-xs text-white/50">
              <span>{form.name || t.club.member}</span>
              <span>{t.account.memberSince}</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="rounded-3xl border border-border bg-white p-5">
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">{t.account.quick}</p>
            <div className="grid gap-2">
              <Link href="/orders" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition hover:bg-ys-mint">
                <Package className="size-4.5 text-ys-deep" />
                {t.nav.orders}
                <span className="ms-auto text-xs text-muted-foreground">{hydrated ? num(orders.length, lang) : ""}</span>
              </Link>
              <Link href="/wishlist" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition hover:bg-ys-mint">
                <Heart className="size-4.5 text-ys-tangerine" />
                {t.nav.wishlist}
                <span className="ms-auto text-xs text-muted-foreground">{hydrated ? num(wishlist.length, lang) : ""}</span>
              </Link>
              <Link href="/about" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition hover:bg-ys-mint">
                <MapPin className="size-4.5 text-ys-green" />
                {t.footer.branches}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
