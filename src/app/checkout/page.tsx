"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Banknote, Check, CreditCard, MapPin, Truck } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/context/app";
import { money } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
  const {
    t, lang, cart, cartSubtotal, discount, deliveryFee, placeOrder, profile, hydrated,
  } = useApp();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [addr, setAddr] = useState({
    name: profile.name, phone: profile.phone, city: profile.city, street: profile.street, notes: "",
  });
  const [slot, setSlot] = useState("express");
  const [payment, setPayment] = useState<"cod" | "card">("cod");
  const [placing, setPlacing] = useState(false);

  const rush = slot === "express" ? 25 : 0;
  const total = cartSubtotal - discount + deliveryFee + rush;
  const steps = [t.checkout.step1, t.checkout.step2, t.checkout.step3];

  if (hydrated && cart.length === 0 && !placing) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-28 text-center">
        <span className="text-6xl">🧺</span>
        <h1 className="font-display mt-5 text-3xl text-ys-ink">{t.cart.empty}</h1>
        <Button asChild size="lg" className="mt-7 rounded-full bg-ys-deep px-8 text-white hover:bg-ys-green">
          <Link href="/shop">{t.cart.goShopping}</Link>
        </Button>
      </div>
    );
  }

  const next = () => {
    if (step === 0 && (!addr.name.trim() || !addr.phone.trim() || !addr.city.trim() || !addr.street.trim())) {
      toast.error(t.checkout.required);
      return;
    }
    setStep((s) => s + 1);
  };

  const place = () => {
    setPlacing(true);
    const order = placeOrder(
      { name: addr.name, phone: addr.phone, city: addr.city, street: addr.street, notes: addr.notes },
      slot,
      payment,
      rush
    );
    router.push(`/order/${order.id}`);
  };

  const field = "h-11 rounded-xl bg-white";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl text-ys-ink sm:text-4xl">{t.checkout.title}</h1>

      {/* Stepper */}
      <div className="mt-8 flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={i} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition",
                i < step ? "bg-ys-green text-white" : i === step ? "bg-ys-deep text-white" : "bg-ys-mint text-ys-deep/60"
              )}
            >
              {i < step ? <Check className="size-4" /> : i + 1}
            </span>
            <span className={cn("hidden text-sm font-semibold sm:block", i === step ? "text-ys-ink" : "text-muted-foreground")}>
              {s}
            </span>
            {i < steps.length - 1 && <span className="h-0.5 flex-1 rounded bg-ys-mint" />}
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_260px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="rounded-3xl border border-border bg-ys-mint/30 p-6"
          >
            {step === 0 && (
              <div className="grid gap-4">
                <p className="flex items-center gap-2 font-bold text-ys-deep"><MapPin className="size-4" /> {t.checkout.step1}</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <Label>{t.checkout.name} *</Label>
                    <Input className={field} value={addr.name} onChange={(e) => setAddr({ ...addr, name: e.target.value })} />
                  </div>
                  <div className="grid gap-1.5">
                    <Label>{t.checkout.phone} *</Label>
                    <Input className={field} dir="ltr" value={addr.phone} onChange={(e) => setAddr({ ...addr, phone: e.target.value })} />
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label>{t.checkout.city} *</Label>
                  <Input className={field} value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} />
                </div>
                <div className="grid gap-1.5">
                  <Label>{t.checkout.street} *</Label>
                  <Input className={field} value={addr.street} onChange={(e) => setAddr({ ...addr, street: e.target.value })} />
                </div>
                <div className="grid gap-1.5">
                  <Label>{t.checkout.notes}</Label>
                  <Input className={field} value={addr.notes} onChange={(e) => setAddr({ ...addr, notes: e.target.value })} />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="grid gap-4">
                <p className="flex items-center gap-2 font-bold text-ys-deep"><Truck className="size-4" /> {t.checkout.step2}</p>
                <RadioGroup value={slot} onValueChange={setSlot} className="grid gap-3">
                  {[
                    { v: "express", l: t.checkout.slotExpress, s: t.checkout.slotExpressSub },
                    { v: "today", l: t.checkout.slotToday, s: "" },
                    { v: "tomorrow", l: t.checkout.slotTomorrow, s: "" },
                  ].map((o) => (
                    <Label
                      key={o.v}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-2xl border bg-white p-4 transition",
                        slot === o.v ? "border-ys-green ring-2 ring-ys-green/20" : "border-border"
                      )}
                    >
                      <RadioGroupItem value={o.v} />
                      <span className="flex-1">
                        <span className="block font-semibold">{o.l}</span>
                        {o.s && <span className="text-xs text-ys-tangerine">{o.s}</span>}
                      </span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-4">
                <p className="flex items-center gap-2 font-bold text-ys-deep"><CreditCard className="size-4" /> {t.checkout.step3}</p>
                <RadioGroup value={payment} onValueChange={(v) => setPayment(v as "cod" | "card")} className="grid gap-3">
                  <Label
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-2xl border bg-white p-4 transition",
                      payment === "cod" ? "border-ys-green ring-2 ring-ys-green/20" : "border-border"
                    )}
                  >
                    <RadioGroupItem value="cod" />
                    <Banknote className="size-5 text-ys-deep" />
                    <span className="flex-1">
                      <span className="block font-semibold">{t.checkout.cod}</span>
                      <span className="text-xs text-muted-foreground">{t.checkout.codSub}</span>
                    </span>
                  </Label>
                  <Label
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-2xl border bg-white p-4 transition",
                      payment === "card" ? "border-ys-green ring-2 ring-ys-green/20" : "border-border"
                    )}
                  >
                    <RadioGroupItem value="card" />
                    <CreditCard className="size-5 text-ys-deep" />
                    <span className="flex-1">
                      <span className="block font-semibold">{t.checkout.card}</span>
                      <span className="text-xs text-muted-foreground">{t.checkout.cardSub}</span>
                    </span>
                  </Label>
                </RadioGroup>
                {payment === "card" && (
                  <div className="grid gap-3 rounded-2xl border border-border bg-white p-4 sm:grid-cols-[1fr_100px_80px]" dir="ltr">
                    <Input placeholder="4242 4242 4242 4242" className={field} />
                    <Input placeholder={t.checkout.cardExp} className={field} />
                    <Input placeholder={t.checkout.cardCvc} className={field} />
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 flex justify-between">
              {step > 0 ? (
                <Button variant="outline" className="rounded-full" onClick={() => setStep((s) => s - 1)}>
                  {t.checkout.back}
                </Button>
              ) : <span />}
              {step < 2 ? (
                <Button className="rounded-full bg-ys-deep px-8 text-white hover:bg-ys-green" onClick={next}>
                  {t.checkout.next}
                </Button>
              ) : (
                <Button className="rounded-full bg-ys-tangerine px-8 font-bold text-white hover:bg-ys-deep" onClick={place} disabled={placing}>
                  {t.checkout.place} · {money(total, lang)}
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Mini summary */}
        <aside className="h-fit rounded-3xl border border-border bg-white p-5 text-sm shadow-sm">
          <h2 className="font-display mb-3 text-lg text-ys-ink">{t.cart.summary}</h2>
          <div className="space-y-1.5">
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
              <span>{deliveryFee + rush === 0 ? t.cart.free : money(deliveryFee + rush, lang)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2.5 text-base font-extrabold text-ys-ink">
              <span>{t.cart.grandTotal}</span><span>{money(total, lang)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
