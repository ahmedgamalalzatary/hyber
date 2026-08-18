"use client";

import { useEffect, useState } from "react";
import { num } from "@/lib/format";
import { useApp } from "@/context/app";

function remaining() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = Math.max(0, midnight.getTime() - now.getTime());
  return {
    h: Math.floor(diff / 3_600_000),
    m: Math.floor((diff % 3_600_000) / 60_000),
    s: Math.floor((diff % 60_000) / 1000),
  };
}

export function Countdown() {
  const { lang } = useApp();
  const [time, setTime] = useState<{ h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    setTime(remaining());
    const id = setInterval(() => setTime(remaining()), 1000);
    return () => clearInterval(id);
  }, []);

  const cell = (v: number) => (
    <span className="flex min-w-10 items-center justify-center rounded-lg bg-ys-ink px-2 py-1.5 font-mono text-lg font-bold tabular-nums text-white">
      {time ? num(v, lang).padStart(2, lang === "ar" ? "٠" : "0") : "--"}
    </span>
  );

  return (
    <div className="flex items-center gap-1.5" dir="ltr">
      {cell(time?.h ?? 0)}
      <span className="font-bold text-ys-ink">:</span>
      {cell(time?.m ?? 0)}
      <span className="font-bold text-ys-ink">:</span>
      {cell(time?.s ?? 0)}
    </div>
  );
}
