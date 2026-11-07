"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Kanban, Settings, Sparkles, List, Calendar, BarChart3, FileText, Users, Puzzle } from "lucide-react";
import { useState } from "react";

type NavItem = {
  label: string;
  href?: string;
  icon: any;
  children?: { label: string; href: string }[];
};

export default function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string[]>(["Dashboard", "Tasks", "Settings"]);

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      children: [
        { label: "Overview", href: "/" },
        { label: "Analytics", href: "/analytics" },
        { label: "Reports", href: "/reports" },
      ],
    },
    {
      label: "Tasks",
      icon: Kanban,
      children: [
        { label: "Board", href: "/board" },
        { label: "List", href: "/list" },
        { label: "Calendar", href: "/calendar" },
      ],
    },
    {
      label: "Settings",
      icon: Settings,
      children: [
        { label: "Profile", href: "/settings" },
        { label: "Team", href: "/settings/team" },
        { label: "Integrations", href: "/settings/integrations" },
      ],
    },
  ];

  const toggle = (label: string) => {
    setExpanded((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const isParentActive = (item: NavItem) =>
    item.children?.some((child) => pathname === child.href);

  return (
    <aside className="w-64 bg-white border-r border-zinc-200/80 flex flex-col py-6 select-none shrink-0 h-screen sticky top-0 overflow-y-auto">
      <div className="flex flex-col gap-8 w-full px-4">
        {/* App Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 px-2"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold text-zinc-900">Taska</span>
        </Link>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isExpanded = expanded.includes(item.label);
            const hasActiveChild = isParentActive(item);
            
            return (
              <div key={item.label}>
                {/* Parent Item */}
                <button
                  onClick={() => toggle(item.label)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                  hasActiveChild
                    ? "bg-teal-50 text-teal-900"
                    : "text-zinc-600 hover:bg-teal-50 hover:text-teal-900"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="text-sm font-semibold flex-1">{item.label}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Children with SVG Branch Lines */}
                {isExpanded && item.children && (
                  <div className="relative pl-3 mt-1">
                    <svg className="nav-branch-lines absolute left-3 top-0" width="40" height={item.children.length * 36} aria-hidden="true">
                      <path className="nav-branch-base" d={`M 22 0 V ${item.children.length * 36 - 14}`} stroke="#e4e4e7" strokeWidth="1.5" fill="none" />
                      {item.children.map((_, idx) => (
                        <path
                          key={idx}
                          className="nav-branch-base"
                          d={`M 22 ${idx * 36 + 14} A 8 8 0 0 0 30 ${idx * 36 + 22} H 36`}
                          stroke="#e4e4e7"
                          strokeWidth="1.5"
                          fill="none"
                        />
                      ))}
                      {item.children.map((_, idx) => (
                        <path
                          key={`reach-${idx}`}
                          className="nav-branch-reach"
                          d={`M 22 0 V ${idx * 36 + 14} A 8 8 0 0 0 30 ${idx * 36 + 22} H 36`}
                          stroke="#18181b"
                          strokeWidth="1.5"
                          fill="none"
                          style={{
                            strokeDasharray: idx * 36 + 32.5664,
                            strokeDashoffset: pathname === item.children[idx].href ? 0 : idx * 36 + 32.5664,
                            transition: "stroke-dashoffset 0.3s ease"
                          }}
                        />
                      ))}
                    </svg>
                    
                    <div className="pl-10 flex flex-col gap-1">
                      {item.children.map((child) => {
                        const isActive = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              isActive
                                ? "bg-teal-600 text-white"
                                : "text-zinc-600 hover:bg-teal-50 hover:text-teal-900"
                            }`}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* User Avatar */}
      <div className="mt-auto px-4 pt-4 border-t border-zinc-100">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-zinc-800 text-white flex items-center justify-center text-xs font-semibold ring-2 ring-zinc-100">
            K
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-zinc-900 truncate">Kal</p>
            <p className="text-xs text-zinc-500 truncate">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
