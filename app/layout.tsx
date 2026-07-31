import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { AppShell } from "@/src/components/layout/app-shell";
import { QueryProvider } from "@/src/lib/query-client";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Gapir — узбекский каждый день",
    template: "%s · Gapir",
  },
  description:
    "Современное приложение для изучения живого узбекского языка.",
  icons: {
    icon: "/gapir-logo.png",
    shortcut: "/gapir-logo.png",
  },
  openGraph: {
    title: "Gapir — узбекский каждый день",
    description: "Учите живой узбекский короткими понятными уроками.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Gapir" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gapir — узбекский каждый день",
    description: "Учите живой узбекский короткими понятными уроками.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${jakarta.variable} antialiased`}>
        <QueryProvider>
          <AppShell>{children}</AppShell>
        </QueryProvider>
      </body>
    </html>
  );
}
