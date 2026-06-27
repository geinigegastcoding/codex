import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "J.A.R.V.I.S.",
  description: "Magisdata Operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-slate-950 text-cyan-400 font-mono p-4 flex flex-col overflow-hidden select-none">
        {/* Background Grid Lines (Decorative) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#08334422_1px,transparent_1px),linear-gradient(to_bottom,#08334422_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none -z-10"></div>
        
        {/* Header */}
        <header className="flex justify-between items-start mb-8 z-10 relative">
          <div>
            <h1 className="text-3xl font-bold tracking-widest flex items-center gap-2">
              <span className="text-cyan-200">⬢</span> J.A.R.V.I.S.
            </h1>
            <p className="text-xs text-cyan-600 mt-1 uppercase tracking-widest">
              Objective: Expedite Magisdata Operations
            </p>
          </div>

          <Navigation />

          {/* Top Right Info */}
          <div className="text-right text-xs">
            <div className="text-xl font-bold tracking-widest text-cyan-100">19:15:33.42</div>
            <div className="text-cyan-600">SESSION: MAGIS-0220</div>
            <div className="text-cyan-600">LEVEL-4 AUTH</div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 relative z-10 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
