export type Lang = "en" | "ar";

export type Localized = { en: string; ar: string };

export type Product = {
  slug: string;
  name: Localized;
  cat: string;
  price: number;
  oldPrice?: number;
  unit: Localized;
  img: string;
  rating: number;
  reviews: number;
  badge?: "sale" | "new" | "best";
  stock: number;
  desc: Localized;
};

export type Category = {
  slug: string;
  name: Localized;
  img: string;
  blurb: Localized;
};

export type CartItem = { slug: string; qty: number };

export type Address = {
  name: string;
  phone: string;
  city: string;
  street: string;
  notes?: string;
};

export type Order = {
  id: string;
  date: string; // ISO
  items: { slug: string; qty: number; price: number }[];
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
  promo?: string;
  address: Address;
  slot: string;
  payment: "cod" | "card";
  status: "confirmed" | "preparing" | "on-the-way" | "delivered";
};
