import type { Metadata } from "next";
import { Fraunces, Figtree, Cairo, Aref_Ruqaa } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/app";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { Toaster } from "@/components/ui/sonner";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

const ruqaa = Aref_Ruqaa({
  variable: "--font-ruqaa",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Awlad El Shikh | أسواق أولاد الشيخ",
  description:
    "Egypt's neighbourhood hypermarket — fresh food, fair prices, everything under one roof. Demo website.",
  icons: { icon: "/logo.png" },
};

const langScript = `
try {
  var l = JSON.parse(localStorage.getItem("ys-lang") || '"ar"');
  document.documentElement.lang = l;
  document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
} catch (e) {}
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${fraunces.variable} ${figtree.variable} ${cairo.variable} ${ruqaa.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: langScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-ys-paper">
        <AppProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <Toaster position="bottom-center" richColors />
        </AppProvider>
      </body>
    </html>
  );
}
