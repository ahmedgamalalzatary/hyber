import type { Lang } from "./types";

export function money(n: number, lang: Lang): string {
  const nf = new Intl.NumberFormat(lang === "ar" ? "ar-EG" : "en-EG", {
    maximumFractionDigits: 0,
  });
  return lang === "ar" ? `${nf.format(n)} ج.م` : `${nf.format(n)} EGP`;
}

export function num(n: number, lang: Lang): string {
  return new Intl.NumberFormat(lang === "ar" ? "ar-EG" : "en-EG").format(n);
}

export function fmtDate(iso: string, lang: Lang): string {
  return new Date(iso).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
