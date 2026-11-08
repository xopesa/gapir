import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { QueryProvider } from "@/src/lib/query-client";
import { ThemeProvider } from "@/src/components/theme/theme-provider";
import { SoundProvider } from "@/src/components/sound/sound-provider";
import { THEME_INIT_SCRIPT } from "@/src/lib/theme/theme-manager";
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
    default: "Gapir — языки каждый день",
    template: "%s · Gapir",
  },
  description:
    "Современное приложение для изучения живых языков короткими понятными уроками.",
  icons: {
    icon: "/gapir-logo.png",
    shortcut: "/gapir-logo.png",
  },
  openGraph: {
    title: "Gapir — языки каждый день",
    description: "Учите живой язык короткими понятными уроками.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Gapir" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gapir — языки каждый день",
    description: "Учите живой язык короткими понятными уроками.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} /></head>
      <body className={`${jakarta.variable} antialiased`}>
        <ThemeProvider><SoundProvider><QueryProvider>{children}</QueryProvider></SoundProvider></ThemeProvider>
      </body>
    </html>
  );
}
