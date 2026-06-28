"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CompanySidebar() {
  const pathname = usePathname();

  const categories = [
    {
      title: "OVERVIEW & FINANCIALS",
      links: [
        { name: "Dashboard", path: "/company" },
      ]
    },
    {
      title: "OPERATIONS",
      links: [
        { name: "Clients & Projects", path: "/company/clients" },
        { name: "Customers", path: "/company/customers" },
        { name: "Tasks & Todos", path: "/company/tasks" },
      ]
    },
    {
      title: "GROWTH",
      links: [
        { name: "Lead Generator", path: "/company/leads" },
      ]
    },
    {
      title: "ANALYTICS & SEO",
      links: [
        { name: "SEO & Tools", path: "/company/seo" },
      ]
    }
  ];

  return (
    <aside className="w-64 border-r border-cyan-900/50 pr-4 h-full overflow-y-auto flex flex-col gap-6 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent">
      <div className="text-cyan-500 text-xs tracking-widest uppercase mb-2 border-b border-cyan-900/50 pb-2">
        Magisdata Modules
      </div>
      
      {categories.map((category, idx) => (
        <div key={idx} className="flex flex-col gap-2">
          <h3 className="text-[10px] text-cyan-700 tracking-[0.2em] font-bold">
            {category.title}
          </h3>
          <div className="flex flex-col gap-1">
            {category.links.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`px-3 py-2 text-sm tracking-wide transition-all border-l-2 ${
                    isActive
                      ? "border-cyan-400 bg-cyan-950/40 text-cyan-200 shadow-[inset_2px_0_10px_rgba(34,211,238,0.1)]"
                      : "border-transparent text-cyan-600 hover:text-cyan-400 hover:border-cyan-800 hover:bg-cyan-950/20"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </aside>
  );
}
