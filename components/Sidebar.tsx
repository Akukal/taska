"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Kanban, Settings, Sparkles } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Overview", href: "/", icon: LayoutDashboard },
    { label: "Board", href: "/board", icon: Kanban },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-16 md:w-20 bg-white border-r border-zinc-200/80 flex flex-col items-center py-6 justify-between select-none shrink-0 h-screen sticky top-0">
      <div className="flex flex-col items-center gap-8 w-full">
        {/* App Logo */}
        <Link
          href="/"
          className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-teal-400 shadow-sm hover:scale-105 transition-transform"
        >
          <Sparkles className="w-5 h-5" />
        </Link>

        {/* Navigation Items */}
        <nav className="flex flex-col items-center gap-3 w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                }`}
              >
                {isActive && (
                  <span className="absolute -left-3 md:-left-4.5 w-1 h-5 bg-teal-500 rounded-r-full" />
                )}
                <Icon className="w-5 h-5" />
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Avatar */}
      <div className="w-9 h-9 rounded-full bg-zinc-800 text-white flex items-center justify-center text-xs font-semibold ring-2 ring-zinc-100">
        K
      </div>
    </aside>
  );
}
