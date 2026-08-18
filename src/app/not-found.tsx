"use client";

import Link from "next/link";
import { useApp } from "@/context/app";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const { t } = useApp();
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-32 text-center">
      <p className="font-display text-8xl text-ys-green/30">404</p>
      <h1 className="font-display mt-4 text-3xl text-ys-ink">{t.notFound.title}</h1>
      <p className="mt-2 text-muted-foreground">{t.notFound.sub}</p>
      <Button asChild size="lg" className="mt-8 rounded-full bg-ys-deep px-8 text-white hover:bg-ys-green">
        <Link href="/">{t.notFound.cta}</Link>
      </Button>
    </div>
  );
}
