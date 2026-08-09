import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.example.com"),
  title: "Vertrouwde spoed loodgieter",
  description: "Op zoek naar een betrouwbare spoed loodgieter? Wij bieden 24/7 snelle service voor lekkages, verstoppingen en cv-ketel onderhoud.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Vertrouwde spoed loodgieter",
    description: "Op zoek naar een betrouwbare spoed loodgieter? Wij bieden 24/7 snelle service voor lekkages, verstoppingen en cv-ketel onderhoud.",
    type: "website",
    locale: "nl_NL",
    url: "/",
  },
};

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <head>
        <LocalBusinessSchema />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
