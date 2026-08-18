"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LayoutGrid, List, SearchX, SlidersHorizontal } from "lucide-react";
import { useApp } from "@/context/app";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { ProductCard } from "@/components/product-card";
import { num, money } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const MAX_PRICE = 25000;

function ShopInner() {
  const { t, L, lang, dir } = useApp();
  const params = useSearchParams();
  const q = params.get("q")?.toLowerCase() ?? "";
  const dealsOnly = params.get("deals") === "1";

  const [cat, setCat] = useState(params.get("cat") ?? "all");

  // Header/footer category links land here with ?cat= — follow URL changes
  useEffect(() => {
    setCat(params.get("cat") ?? "all");
  }, [params]);
  const [price, setPrice] = useState<[number, number]>([0, MAX_PRICE]);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("popular");
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    let list = products.filter(
      (p) =>
        (cat === "all" || p.cat === cat) &&
        p.price >= price[0] &&
        p.price <= price[1] &&
        p.rating >= minRating &&
        (!dealsOnly || p.badge === "sale") &&
        (!q ||
          p.name.en.toLowerCase().includes(q) ||
          p.name.ar.includes(q) ||
          p.slug.includes(q))
    );
    switch (sort) {
      case "priceAsc": list = [...list].sort((a, b) => a.price - b.price); break;
      case "priceDesc": list = [...list].sort((a, b) => b.price - a.price); break;
      case "rating": list = [...list].sort((a, b) => b.rating - a.rating); break;
      default: list = [...list].sort((a, b) => b.reviews - a.reviews);
    }
    return list;
  }, [cat, price, minRating, sort, q, dealsOnly]);

  const clear = () => {
    setCat("all");
    setPrice([0, MAX_PRICE]);
    setMinRating(0);
  };

  const Filters = (
    <div className="space-y-7">
      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-ys-deep">{t.shop.categories}</h3>
        <div className="grid gap-1">
          <button
            onClick={() => setCat("all")}
            className={cn(
              "rounded-lg px-3 py-2 text-start text-sm font-medium transition",
              cat === "all" ? "bg-ys-deep text-white" : "hover:bg-ys-mint"
            )}
          >
            {t.shop.all}
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => setCat(c.slug)}
              className={cn(
                "rounded-lg px-3 py-2 text-start text-sm font-medium transition",
                cat === c.slug ? "bg-ys-deep text-white" : "hover:bg-ys-mint"
              )}
            >
              {L(c.name)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-ys-deep">{t.shop.price}</h3>
        <Slider
          value={price}
          min={0}
          max={MAX_PRICE}
          step={50}
          onValueChange={(v) => setPrice(v as [number, number])}
        />
        <div className="mt-3 flex justify-between text-xs font-semibold text-muted-foreground">
          <span>{money(price[0], lang)}</span>
          <span>{money(price[1], lang)}</span>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-ys-deep">{t.shop.minRating}</h3>
        <div className="flex gap-1.5">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={cn(
                "flex-1 rounded-lg border px-2 py-1.5 text-xs font-bold transition",
                minRating === r ? "border-ys-deep bg-ys-deep text-white" : "border-border bg-white hover:border-ys-green"
              )}
            >
              {r === 0 ? t.shop.any : `${num(r, lang)}★+`}
            </button>
          ))}
        </div>
      </div>

      <Button variant="outline" onClick={clear} className="w-full rounded-full">
        {t.shop.clear}
      </Button>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-ys-green">{t.shop.sub}</p>
          <h1 className="font-display mt-1 text-3xl text-ys-ink sm:text-4xl">
            {q ? `“${q}”` : dealsOnly ? t.sections.deals : t.shop.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{t.shop.results.replace("{n}", num(filtered.length, lang))}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Mobile filters */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="rounded-full lg:hidden">
                <SlidersHorizontal className="size-4" />
                {t.shop.filters}
              </Button>
            </SheetTrigger>
            <SheetContent side={dir === "rtl" ? "right" : "left"} className="w-80 overflow-y-auto bg-ys-paper">
              <SheetHeader>
                <SheetTitle>{t.shop.filters}</SheetTitle>
              </SheetHeader>
              <div className="px-4 pb-8">{Filters}</div>
            </SheetContent>
          </Sheet>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-44 rounded-full bg-white">
              <SelectValue placeholder={t.shop.sort} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">{t.shop.sortPopular}</SelectItem>
              <SelectItem value="priceAsc">{t.shop.sortPriceAsc}</SelectItem>
              <SelectItem value="priceDesc">{t.shop.sortPriceDesc}</SelectItem>
              <SelectItem value="rating">{t.shop.sortRating}</SelectItem>
            </SelectContent>
          </Select>

          <div className="hidden overflow-hidden rounded-full border border-border bg-white sm:flex">
            <button
              onClick={() => setLayout("grid")}
              aria-label={t.shop.grid}
              className={cn("px-3 py-2 transition", layout === "grid" ? "bg-ys-deep text-white" : "text-muted-foreground")}
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              onClick={() => setLayout("list")}
              aria-label={t.shop.list}
              className={cn("px-3 py-2 transition", layout === "list" ? "bg-ys-deep text-white" : "text-muted-foreground")}
            >
              <List className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="sticky top-40 hidden h-fit rounded-2xl border border-border bg-white p-5 shadow-sm lg:block">
          {Filters}
        </aside>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-24 text-center">
            <SearchX className="size-10 text-muted-foreground/50" />
            <p className="font-semibold">{t.shop.empty}</p>
            <Button variant="outline" onClick={clear} className="rounded-full">{t.shop.clear}</Button>
          </div>
        ) : layout === "grid" ? (
          <div className="grid grid-cols-2 content-start gap-3 sm:gap-5 xl:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.slug} p={p} />
            ))}
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((p) => (
              <ProductCard key={p.slug} p={p} layout="list" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense>
      <ShopInner />
    </Suspense>
  );
}
