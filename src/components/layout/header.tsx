"use client";

import Link from "next/link";
import { Plus, MessageSquare, Menu } from "lucide-react";

export function Header() {
  return (
    <header className="h-20 border-b-2 border-fwBlack flex items-center justify-between px-6 md:px-8 bg-white/90 backdrop-blur-sm z-10">
      {/* Mobile Menu */}
      <div className="md:hidden flex items-center gap-3">
        <Menu className="w-6 h-6 text-fwBlack" />
        <div className="w-8 h-8 bg-fwBlack text-white flex items-center justify-center rounded-lg rotate-3 shadow-sm">
          <span className="font-display text-xl font-bold">P</span>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4 ml-auto">
        <Link href="/products/new">
          <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border-2 border-fwBlack rounded-full text-sm font-bold shadow-comic hover:shadow-comic-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all active:shadow-none active:translate-x-[4px] active:translate-y-[4px]">
            <Plus className="w-4 h-4" /> Create
          </button>
        </Link>

        <button className="p-2 text-fwBlack border-2 border-transparent hover:border-fwBlack rounded-full hover:bg-white transition-all">
          <MessageSquare className="w-5 h-5" />
        </button>

        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fwPurple to-fwPink border-2 border-fwBlack flex items-center justify-center text-white font-bold shadow-sm cursor-pointer">
          H
        </div>
      </div>
    </header>
  );
}
