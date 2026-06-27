"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { name: 'OVERVIEW', path: '/' },
    { name: 'COMPANY', path: '/company' },
    { name: 'NETWORK', path: '/network' },
    { name: 'TASKS', path: '/tasks' },
    { name: 'LEADS', path: '/leads' },
    { name: 'FINANCIALS', path: '/financials' },
    { name: 'TELEMETRY', path: '/telemetry' },
    { name: 'CONFIG', path: '/config' },
  ];

  return (
    <nav className="flex gap-2">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link
            key={item.name}
            href={item.path}
            className={`px-4 py-1 border text-xs tracking-widest transition-colors uppercase backdrop-blur-sm ${
              isActive
                ? 'bg-cyan-900/50 border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.3)]'
                : 'border-cyan-800 text-cyan-600 hover:bg-cyan-900/30 hover:border-cyan-500'
            }`}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
