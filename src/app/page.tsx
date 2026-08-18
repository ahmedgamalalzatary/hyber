"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, BadgePercent, Clock3, MapPin, Quote, Zap } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/context/app";
import { categories } from "@/data/categories";
import { bestSellers, flashDeals, freshPicks } from "@/data/products";
import { ProductCard } from "@/components/product-card";
import { PromiseMarquee } from "@/components/marquee";
import { Countdown } from "@/components/countdown";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    av: "/img/av1.jpg",
    name: { en: "Mahmoud A.", ar: "محمود أ." },
    role: { en: "Chef, Aswan", ar: "شيف، أسوان" },
    text: {
      en: "I buy for a restaurant, so I smell everything before I pay. Here I stopped checking — they check before me.",
      ar: "أنا بشتري لمطعم، فبشم كل حاجة قبل ما أدفع. هنا بطلت أكشف — هما بيكشفوا قبلي.",
    },
  },
  {
    av: "/img/av2.jpg",
    name: { en: "Nesma H.", ar: "نسمة ح." },
    role: { en: "Mother of three", ar: "أم لثلاثة" },
    text: {
      en: "The 60-minute delivery is real. I ordered at 7:40, the doorbell rang at 8:25, and the eggs were intact.",
      ar: "الستين دقيقة حقيقية. طلبت ٧:٤٠ والجرس ضرب ٨:٢٥ والبيض وصل سليم.",
    },
  },
  {
    av: "/img/av3.jpg",
    name: { en: "Karim S.", ar: "كريم س." },
    role: { en: "Engineer, Cairo", ar: "مهندس، القاهرة" },
    text: {
      en: "Bought a TV and mangoes in the same basket. Where else does that happen with both being excellent?",
      ar: "اشتريت شاشة ومانجة في نفس السلة. فين تاني ده بيحصل والاتنين ممتازين؟",
    },
  },
  {
    av: "/img/av4.jpg",
    name: { en: "Salma R.", ar: "سلمى ر." },
    role: { en: "Pharmacist, Luxor", ar: "صيدلانية، الأقصر" },
    text: {
      en: "Their 'fresh or refunded' rule is not a slogan. I returned strawberries once — no receipt, no questions.",
      ar: "قاعدة «طازة أو فلوسك ترجع» مش شعار. رجّعت فراولة مرة — من غير إيصال ولا سؤال.",
    },
  },
];

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

export default function HomePage() {
  const { t, L, lang, dir } = useApp();
  const [email, setEmail] = useState("");
  const reduce = useReducedMotion();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <div className="overflow-x-clip">
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="ys-grain relative bg-ys-paper">
        <div className="mx-auto grid max-w-7xl items-stretch gap-0 px-4 pt-10 lg:grid-cols-[1.05fr_1fr] lg:pt-0">
          <div className="relative z-10 flex flex-col justify-center pb-14 lg:min-h-[560px] lg:pb-20 lg:pt-16">
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-ys-green/30 bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-ys-deep shadow-sm"
            >
              <span className="size-1.5 rounded-full bg-ys-green" />
              {t.hero.eyebrow}
            </motion.p>
            <h1 className="font-display text-[2.6rem] leading-[1.08] text-ys-ink sm:text-6xl lg:text-[4.2rem]">
              <motion.span
                className="block"
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.05 }}
              >
                {t.hero.title1}
              </motion.span>
              <motion.span
                className="block text-ys-deep"
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.15 }}
              >
                {t.hero.title2}
              </motion.span>
              <motion.span
                className="block"
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.25 }}
              >
                {t.hero.title3}
              </motion.span>
            </h1>
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              {t.hero.sub}
            </motion.p>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="mt-7 flex flex-wrap items-center gap-3"
            >
              <Button asChild size="lg" className="h-12 rounded-full bg-ys-deep px-7 text-base font-bold text-white shadow-lg shadow-ys-deep/25 transition hover:bg-ys-green">
                <Link href="/shop">
                  {t.hero.ctaShop}
                  <Arrow className="size-4.5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-ys-tangerine/40 bg-white px-7 text-base font-bold text-ys-tangerine hover:bg-ys-tangerine hover:text-white">
                <Link href="/shop?deals=1">
                  <BadgePercent className="size-4.5" />
                  {t.hero.ctaDeals}
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Image side, clipped on the logo's diagonal */}
          <div className="relative -mx-4 h-72 sm:h-96 lg:mx-0 lg:h-auto">
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="absolute inset-0 lg:ys-slash-clip"
            >
              <Image
                src="/img/hero-produce.jpg"
                alt=""
                fill
                priority
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ys-ink/50 via-transparent to-transparent" />
            </motion.div>
            {/* Giant ruqaa word overlapping the image */}
            <motion.span
              initial={reduce ? false : { opacity: 0, y: 30, rotate: -6 }}
              animate={{ opacity: 1, y: 0, rotate: -6 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="font-ruqaa absolute bottom-6 start-6 select-none text-6xl text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.45)] sm:text-7xl lg:bottom-14"
              aria-hidden
            >
              {t.hero.freshWord}
            </motion.span>
          </div>
        </div>
        <PromiseMarquee />
      </section>

      {/* ── AISLES ───────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pt-20">
        <Reveal>
          <SectionHead title={t.sections.aisles} sub={t.sections.aislesSub} />
        </Reveal>
        <Reveal delay={0.1} y={32}>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/shop?cat=${c.slug}`}
                className="group relative block aspect-[4/3] overflow-hidden rounded-2xl shadow-sm"
              >
                <Image
                  src={c.img}
                  alt={L(c.name)}
                  fill
                  sizes="(max-width:640px) 50vw, 25vw"
                  className="object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ys-ink/85 via-ys-ink/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="font-display text-lg leading-tight text-white">{L(c.name)}</p>
                  <p className="mt-0.5 text-xs text-white/70 opacity-0 transition duration-300 group-hover:opacity-100">
                    {L(c.blurb)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── FLASH DEALS ──────────────────────────────────── */}
      <section className="mt-20 bg-gradient-to-b from-ys-mint/60 to-transparent py-16">
        <div className="mx-auto max-w-7xl px-4">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ys-tangerine">
                  <Zap className="size-4 fill-current" /> {t.sections.dealsSub}
                </p>
                <h2 className="font-display mt-1 text-3xl text-ys-ink sm:text-4xl">{t.sections.deals}</h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-muted-foreground">{t.sections.endsIn}</span>
                <Countdown />
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08} y={32}>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {flashDeals.slice(0, 8).map((p) => (
                <ProductCard key={p.slug} p={p} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── BEST SELLERS ─────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pt-6">
        <Reveal>
          <SectionHead title={t.sections.best} sub={t.sections.bestSub} href="/shop" cta={t.sections.viewAll} />
        </Reveal>
        <div className="no-scrollbar -mx-4 mt-8 flex snap-x gap-4 overflow-x-auto px-4 pb-2">
          {bestSellers.map((p) => (
            <div key={p.slug} className="w-56 shrink-0 snap-start sm:w-64">
              <ProductCard p={p} />
            </div>
          ))}
        </div>
      </section>

      {/* ── FRESH BANNER ─────────────────────────────────── */}
      <section className="relative mx-auto mt-20 max-w-7xl overflow-hidden rounded-3xl bg-ys-deep px-4 lg:mx-6 xl:mx-auto">
        <span
          aria-hidden
          className="font-ruqaa pointer-events-none absolute -top-10 end-4 select-none text-[11rem] leading-none text-white/[0.07] sm:text-[16rem]"
        >
          {t.hero.freshWord}
        </span>
        <div className="relative grid items-center gap-8 py-14 sm:px-8 lg:grid-cols-2">
          <Reveal>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-ys-bright">{t.sections.freshSub}</p>
              <h2 className="font-display mt-2 text-3xl text-white sm:text-4xl">{t.sections.fresh}</h2>
              <div className="mt-8 grid grid-cols-2 gap-3">
                {freshPicks.slice(0, 4).map((p) => (
                  <Link
                    key={p.slug}
                    href={`/product/${p.slug}`}
                    className="group flex items-center gap-3 rounded-2xl bg-white/10 p-2.5 backdrop-blur transition hover:bg-white/20"
                  >
                    <span className="relative size-14 shrink-0 overflow-hidden rounded-xl">
                      <Image src={p.img} alt={L(p.name)} fill sizes="56px" className="object-cover transition group-hover:scale-110" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-white">{L(p.name)}</span>
                      <span className="text-xs text-ys-bright">{L(p.unit)}</span>
                    </span>
                  </Link>
                ))}
              </div>
              <Button asChild className="mt-8 rounded-full bg-white px-6 font-bold text-ys-deep hover:bg-ys-bright hover:text-white">
                <Link href="/shop?cat=produce">
                  {t.sections.viewAll}
                  <Arrow className="size-4" />
                </Link>
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.15} className="relative hidden aspect-[4/3] overflow-hidden rounded-2xl lg:block">
            <Image src="/img/greens.jpg" alt="" fill sizes="50vw" className="object-cover" />
          </Reveal>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pt-20">
        <Reveal y={32}>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border lg:grid-cols-4">
            {t.stats.map((s, i) => (
              <div key={i} className="bg-white px-6 py-8 text-center">
                <p className="font-display text-4xl text-ys-deep sm:text-5xl">{s.n}</p>
                <p className="mt-1.5 text-sm font-medium text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── DELIVERY BANNER ──────────────────────────────── */}
      <section className="mx-auto mt-20 grid max-w-7xl items-center gap-8 px-4 lg:grid-cols-2">
        <Reveal className="relative order-2 aspect-[4/3] overflow-hidden rounded-3xl lg:order-1">
          <Image src="/img/delivery.jpg" alt="" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
          <div className="absolute bottom-4 start-4 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-extrabold text-ys-deep shadow-lg">
            <Clock3 className="size-4 text-ys-tangerine" />
            60:00
          </div>
        </Reveal>
        <Reveal delay={0.1} className="order-1 lg:order-2">
          <div>
            <h2 className="font-display text-3xl leading-tight text-ys-ink sm:text-4xl">{t.delivery.title}</h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">{t.delivery.sub}</p>
            <Button asChild size="lg" className="mt-7 h-12 rounded-full bg-ys-tangerine px-7 text-base font-bold text-white hover:bg-ys-deep">
              <Link href="/shop">
                {t.delivery.cta}
                <Arrow className="size-4.5" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pt-20">
        <Reveal>
          <SectionHead title={t.sections.testimonials} sub={t.sections.testimonialsSub} />
        </Reveal>
        <Reveal delay={0.08} y={32}>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((tm, i) => (
            <div key={i}>
              <figure className="flex h-full flex-col rounded-2xl border border-border bg-white p-5 shadow-sm">
                <Quote className="size-6 -scale-x-100 text-ys-green/40" />
                <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-ys-ink/90">{L(tm.text)}</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <Image src={tm.av} alt={L(tm.name)} width={38} height={38} className="rounded-full" />
                  <span>
                    <span className="block text-sm font-bold">{L(tm.name)}</span>
                    <span className="text-xs text-muted-foreground">{L(tm.role)}</span>
                  </span>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
        </Reveal>
      </section>

      {/* ── BRANCHES ─────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pt-20">
        <Reveal>
          <SectionHead title={t.sections.branches} sub={t.sections.branchesSub} href="/about" cta={t.sections.viewAll} />
        </Reveal>
        <Reveal delay={0.08} y={32}>
          <div className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
            {branches.slice(0, 8).map((b, i) => (
              <div key={i} className="flex items-center gap-2.5 rounded-xl border border-border bg-white px-4 py-3.5 text-sm font-medium shadow-sm transition hover:border-ys-green/50">
                <MapPin className="size-4 shrink-0 text-ys-green" />
                <span className="truncate">{L(b)}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── NEWSLETTER ───────────────────────────────────── */}
      <section className="mx-auto mt-20 max-w-7xl px-4">
        <Reveal>
          <div className="ys-grain relative overflow-hidden rounded-3xl bg-ys-ink px-6 py-14 text-center sm:px-12">
            <div
              aria-hidden
              className="absolute -end-24 -top-24 size-72 rotate-[24deg] rounded-3xl bg-ys-green/20"
            />
            <div
              aria-hidden
              className="absolute -bottom-28 -start-20 size-72 rotate-[24deg] rounded-3xl bg-ys-tangerine/15"
            />
            <h2 className="font-display relative text-3xl text-white sm:text-4xl">{t.sections.newsletter}</h2>
            <p className="relative mx-auto mt-3 max-w-md text-sm text-white/70">{t.sections.newsletterSub}</p>
            <form
              className="relative mx-auto mt-7 flex max-w-md gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!email.trim()) return;
                setEmail("");
                toast.success(t.sections.newsletterDone);
              }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.sections.newsletterPlaceholder}
                className="h-12 flex-1 rounded-full border border-white/20 bg-white/10 px-5 text-sm text-white outline-none backdrop-blur placeholder:text-white/50 focus:border-ys-bright"
              />
              <Button type="submit" className="h-12 rounded-full bg-ys-green px-6 font-bold text-white hover:bg-ys-bright">
                {t.sections.newsletterBtn}
              </Button>
            </form>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function SectionHead({ title, sub, href, cta }: { title: string; sub: string; href?: string; cta?: string }) {
  const { dir } = useApp();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-ys-green">{sub}</p>
        <h2 className="font-display mt-1 text-3xl text-ys-ink sm:text-4xl">{title}</h2>
      </div>
      {href && cta && (
        <Link href={href} className="flex items-center gap-1.5 text-sm font-bold text-ys-deep transition hover:text-ys-green">
          {cta} <Arrow className="size-4" />
        </Link>
      )}
    </div>
  );
}
