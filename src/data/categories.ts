import type { Category } from "@/lib/types";

export const categories: Category[] = [
  { slug: "produce", name: { en: "Fruits & Vegetables", ar: "خضار وفواكه" }, img: "/img/hero-produce.jpg", blurb: { en: "Picked at dawn, shelved by nine", ar: "متقطف الفجر وعلى الرف الساعة ٩" } },
  { slug: "bakery", name: { en: "Bakery", ar: "المخبوزات" }, img: "/img/baguette.jpg", blurb: { en: "Ovens run all day", ar: "الأفران شغالة طول اليوم" } },
  { slug: "meat", name: { en: "Meat, Poultry & Seafood", ar: "لحوم ودواجن وأسماك" }, img: "/img/steak.jpg", blurb: { en: "Cut to order at the counter", ar: "تقطيع حسب الطلب" } },
  { slug: "dairy", name: { en: "Dairy & Eggs", ar: "ألبان وبيض" }, img: "/img/milk.jpg", blurb: { en: "Farm-fresh, chilled cold", ar: "من المزرعة ومتبرد صح" } },
  { slug: "beverages", name: { en: "Beverages", ar: "المشروبات" }, img: "/img/orange-juice.jpg", blurb: { en: "Juices, coffee & more", ar: "عصائر وقهوة وأكتر" } },
  { slug: "snacks", name: { en: "Snacks & Sweets", ar: "تسالي وحلويات" }, img: "/img/nuts.jpg", blurb: { en: "The joyful aisle", ar: "ممر الفرحة" } },
  { slug: "frozen", name: { en: "Frozen", ar: "المجمدات" }, img: "/img/ice-cream.jpg", blurb: { en: "Minus 18 and loving it", ar: "١٨ تحت الصفر" } },
  { slug: "pantry", name: { en: "Pantry & Grocery", ar: "البقالة" }, img: "/img/spices.jpg", blurb: { en: "The staples, stocked deep", ar: "الأساسيات دايمًا موجودة" } },
  { slug: "home", name: { en: "Home & Cleaning", ar: "المنزل والتنظيف" }, img: "/img/candle.jpg", blurb: { en: "A cleaner, softer home", ar: "بيت أنضف وأهدى" } },
  { slug: "beauty", name: { en: "Beauty & Care", ar: "الجمال والعناية" }, img: "/img/makeup.jpg", blurb: { en: "Look after yourself", ar: "اهتم بنفسك" } },
  { slug: "baby", name: { en: "Baby", ar: "الأطفال" }, img: "/img/baby-lotion.jpg", blurb: { en: "Gentle on the little ones", ar: "حنيّن على الصغيرين" } },
  { slug: "electronics", name: { en: "Electronics", ar: "الإلكترونيات" }, img: "/img/headphones.jpg", blurb: { en: "Plugged-in living", ar: "حياة متوصلة بالكهرباء" } },
];
