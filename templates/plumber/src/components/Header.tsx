"use client";

import { useState } from "react";
import Link from "next/link";
import { PhoneCall, Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const brandnaam = "{brandnaam}";
  const phone = "0800-1234567";

  return (
    <header className="bg-white py-4 md:py-5 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-5 flex justify-between items-center max-w-7xl">
        <Link href="/" className="text-xl md:text-2xl font-bold text-blue-800 z-50">
          {brandnaam}
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/" className="font-medium hover:text-blue-800 transition-colors">Home</Link>
          <Link href="/diensten" className="font-medium hover:text-blue-800 transition-colors">Diensten</Link>
          <Link href="/tarieven" className="font-medium hover:text-blue-800 transition-colors">Tarieven</Link>
          <Link href="/projecten" className="font-medium hover:text-blue-800 transition-colors">Projecten</Link>
          <Link href="/werkgebied" className="font-medium hover:text-blue-800 transition-colors">Werkgebied</Link>
          <Link href="/contact" className="font-medium hover:text-blue-800 transition-colors">Contact</Link>
        </nav>

        <div className="flex items-center gap-3 z-50">
          {/* CTA Button - Scaled down on mobile */}
          <a href={`tel:${phone.replace(/-/g, '')}`} className="flex items-center gap-1.5 md:gap-2 bg-amber-400 text-gray-800 px-3 py-2 md:px-6 md:py-3 rounded-lg font-bold hover:bg-amber-500 md:hover:-translate-y-0.5 shadow-sm transition-all text-sm md:text-base">
            <PhoneCall size={16} className="md:w-5 md:h-5" />
            <span className="hidden sm:inline">24/7 spoedservice</span>
            <span className="inline sm:hidden">Bel Nu</span>
          </a>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-gray-800 hover:text-blue-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {isMenuOpen && (
        <nav className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg flex flex-col p-5 gap-4 z-40">
          <Link href="/" onClick={() => setIsMenuOpen(false)} className="font-medium hover:text-blue-800 transition-colors">Home</Link>
          <Link href="/diensten" onClick={() => setIsMenuOpen(false)} className="font-medium hover:text-blue-800 transition-colors">Diensten</Link>
          <Link href="/tarieven" onClick={() => setIsMenuOpen(false)} className="font-medium hover:text-blue-800 transition-colors">Tarieven</Link>
          <Link href="/projecten" onClick={() => setIsMenuOpen(false)} className="font-medium hover:text-blue-800 transition-colors">Projecten</Link>
          <Link href="/werkgebied" onClick={() => setIsMenuOpen(false)} className="font-medium hover:text-blue-800 transition-colors">Werkgebied</Link>
          <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="font-medium hover:text-blue-800 transition-colors">Contact</Link>
        </nav>
      )}
    </header>
  );
}
