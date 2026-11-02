"use client";

import { Bell, Calendar, Plus, Share2, ChevronDown } from "lucide-react";

export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-zinc-200/80 px-6 flex items-center justify-between select-none shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-zinc-900 tracking-tight">Taska</h1>
        <span className="text-xs text-zinc-400 font-normal">/ Project Workspace</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Date Selector Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-200 bg-zinc-50/50 text-xs font-medium text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer">
          <Calendar className="w-3.5 h-3.5 text-zinc-500" />
          <span>Jul 1, 2025 - Jul 30, 2025</span>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
        </div>

        {/* Notifications */}
        <button
          type="button"
          className="w-9 h-9 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
          title="Notifikasi"
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* Export Button */}
        <button
          type="button"
          className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition-colors shadow-sm"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>

        {/* New Task Button */}
        <button
          type="button"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
}
