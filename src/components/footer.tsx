"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone } from "lucide-react";

const socials = [
  // Facebook
  "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  // Instagram (simplified glyph)
  "M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.6 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1s-3.6 0-4.9-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 4 4 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2Zm0 4.6a5.2 5.2 0 1 0 0 10.4 5.2 5.2 0 0 0 0-10.4Zm0 8.6a3.4 3.4 0 1 1 0-6.8 3.4 3.4 0 0 1 0 6.8Zm5.4-8.9a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z",
  // X
  "M17.7 3H21l-7.1 8.1L22.2 21h-6.6l-5.2-6.1L4.5 21H1.2l7.6-8.7L1.8 3h6.8l4.7 5.6L17.7 3Zm-1.2 16h1.8L7.7 4.9H5.8L16.5 19Z",
];
import { useApp } from "@/context/app";
import { categories } from "@/data/categories";

export function Footer() {
  const { t, L } = useApp();

  return (
    <footer className="mt-20 bg-ys-ink text-ys-paper">
      {/* Slash accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-ys-deep via-ys-green to-ys-bright" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt={t.brand} width={52} height={52} className="rounded-full" />
            <div>
              <p className="font-display text-xl">{t.brand}</p>
              <p className="font-ruqaa text-sm text-ys-bright">{t.brandAr}</p>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ys-paper/70">{t.footer.blurb}</p>
          <div className="mt-5 flex gap-2">
            {socials.map((d, i) => (
              <span
                key={i}
                className="flex size-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-ys-green"
              >
                <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
                  <path d={d} />
                </svg>
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-ys-bright">{t.footer.shopCol}</h3>
          <ul className="grid gap-2.5 text-sm text-ys-paper/75">
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link href={`/shop?cat=${c.slug}`} className="transition hover:text-white">
                  {L(c.name)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-ys-bright">{t.footer.companyCol}</h3>
          <ul className="grid gap-2.5 text-sm text-ys-paper/75">
            <li><Link href="/about" className="transition hover:text-white">{t.footer.story}</Link></li>
            <li><Link href="/about" className="transition hover:text-white">{t.footer.branches}</Link></li>
            <li><Link href="/orders" className="transition hover:text-white">{t.nav.orders}</Link></li>
            <li><Link href="/account" className="transition hover:text-white">{t.nav.account}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-ys-bright">{t.footer.helpCol}</h3>
          <ul className="grid gap-2.5 text-sm text-ys-paper/75">
            <li className="flex items-center gap-2"><Phone className="size-4" /> 19620</li>
            <li className="flex items-center gap-2"><MapPin className="size-4" /> {t.footer.branches}</li>
            <li>{t.footer.faq}</li>
            <li>{t.footer.delivery}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-ys-paper/50 sm:flex-row">
          <p>© 2026 {t.brand} — {t.footer.rights}</p>
          <p>{t.footer.payments}</p>
        </div>
      </div>
    </footer>
  );
}
