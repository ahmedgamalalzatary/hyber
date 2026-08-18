"use client";

import { useApp } from "@/context/app";
import { Sparkles } from "lucide-react";

/** The promise band — runs at the slight skew of the logo's slash. */
export function PromiseMarquee() {
  const { t } = useApp();
  const half = [...t.marquee, ...t.marquee, ...t.marquee];
  return (
    <div className="relative z-10 overflow-hidden bg-ys-deep py-3 shadow-lg">
      <div className="ys-marquee-track gap-10 whitespace-nowrap">
        {[...half, ...half].map((m, i) => (
          <span key={i} className="flex shrink-0 items-center gap-3 text-sm font-semibold text-ys-paper">
            <Sparkles className="size-4 shrink-0 text-ys-gold" />
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
