import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "zora | کتاب‌خوان هوشمند مدارس ایران",
  description:
    "سایت رسمی zora: همه‌ی کتاب‌های درسی ابتدایی تا دوازدهم در یک اپلیکیشن کاملاً آفلاین برای ویندوز؛ با ابزارهای یادداشت، پرنده‌های دانش و تجربه‌ای دوست‌داشتنی. دانلود مستقیم آخرین نسخه.",
  keywords: [
    "zora",
    "zora reader",
    "کتاب‌خوان",
    "کتاب‌های درسی",
    "مدارس ایران",
    "دانلود کتاب درسی",
    "اپلیکیشن آموزشی",
    "تخته هوشمند",
  ],
  authors: [{ name: "zora team — ZAK & AXORA" }],
  icons: {
    icon: "/emblem.png",
    apple: "/emblem.png",
  },
  openGraph: {
    title: "zora — همه‌ی کتاب‌های درسی در یک اپ",
    description:
      "کتاب‌خوان رسمی و آفلاین مدارس ایران؛ از اول دبستان تا دوازدهم. دانلود رایگان برای ویندوز ۷ تا ۱۱.",
    siteName: "zora",
    type: "website",
    locale: "fa_IR",
  },
};

export const viewport: Viewport = {
  themeColor: "#090A0D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className="zora-site font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
