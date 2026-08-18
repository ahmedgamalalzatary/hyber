"use client";

import Image from "next/image";
import { BadgeCheck, MapPin } from "lucide-react";
import { useApp } from "@/context/app";
import { Reveal } from "@/components/reveal";

const branches = [
  { en: "Aswan — Corniche (Flagship)", ar: "أسوان — الكورنيش (الرئيسي)" },
  { en: "Luxor — East Bank", ar: "الأقصر — البر الشرقي" },
  { en: "Qena — City Center", ar: "قنا — وسط البلد" },
  { en: "Sohag — El Kawther", ar: "سوهاج — الكوثر" },
  { en: "Asyut — El Gomhoreya", ar: "أسيوط — الجمهورية" },
  { en: "Minya — Corniche", ar: "المنيا — الكورنيش" },
  { en: "Cairo — Maadi", ar: "القاهرة — المعادي" },
  { en: "Giza — Mohandessin", ar: "الجيزة — المهندسين" },
  { en: "Alexandria — Smouha", ar: "الإسكندرية — سموحة" },
  { en: "Mansoura — Gomhoreya St.", ar: "المنصورة — شارع الجمهورية" },
  { en: "Tanta — El Geish St.", ar: "طنطا — شارع الجيش" },
  { en: "Hurghada — Dahar", ar: "الغردقة — الدهار" },
];

export default function AboutPage() {
  const { t, L } = useApp();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ys-ink py-20 text-center text-white">
        <span aria-hidden className="font-ruqaa pointer-events-none absolute -top-8 start-6 select-none text-[10rem] leading-none text-white/5">
          {t.brandAr.split(" ")[0]}
        </span>
        <div className="relative mx-auto max-w-2xl px-4">
          <p className="text-xs font-bold uppercase tracking-widest text-ys-bright">{t.about.sub}</p>
          <h1 className="font-display mt-3 text-4xl sm:text-5xl">{t.about.title}</h1>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-2">
        <Reveal>
          <div className="space-y-5 text-base leading-relaxed text-ys-ink/85 sm:text-lg">
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
              <Image src="/img/aisle.jpg" alt="" fill sizes="25vw" className="object-cover" />
            </div>
            <div className="relative mt-8 aspect-[3/4] overflow-hidden rounded-2xl">
              <Image src="/img/groceries-bag.jpg" alt="" fill sizes="25vw" className="object-cover" />
            </div>
          </div>
        </Reveal>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 pb-4">
        <Reveal>
          <h2 className="font-display text-3xl text-ys-ink">{t.about.valuesTitle}</h2>
        </Reveal>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {t.about.values.map((v, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-border bg-white p-6 shadow-sm">
                <BadgeCheck className="size-7 text-ys-green" />
                <h3 className="mt-3 font-bold text-ys-ink">{v.t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{v.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Branches */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <Reveal>
          <h2 className="font-display text-3xl text-ys-ink">{t.about.branchesTitle}</h2>
        </Reveal>
        <div className="mt-7 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {branches.map((b, i) => (
            <Reveal key={i} delay={Math.min(i * 0.03, 0.2)}>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3.5 font-medium shadow-sm">
                <MapPin className="size-4.5 shrink-0 text-ys-green" />
                {L(b)}
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
