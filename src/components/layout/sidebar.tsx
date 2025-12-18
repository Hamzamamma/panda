"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  DollarSign,
  Shirt,
  Tag,
  Star,
  LayoutTemplate,
  BarChart2,
  Grid,
  Settings,
  ChevronDown,
  ExternalLink
} from "lucide-react";

const navigation = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Orders", href: "/orders", icon: DollarSign },
  { name: "Products", href: "/products", icon: Shirt },
  { name: "Promotions", href: "/promotions", icon: Tag },
  { name: "Memberships", href: "/memberships", icon: Star },
  { name: "Site design", href: "/site-design", icon: LayoutTemplate },
  { name: "Analytics", href: "/analytics", icon: BarChart2 },
  { name: "Apps", href: "/apps", icon: Grid },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r-2 border-fwBlack bg-white flex-col hidden md:flex h-screen fixed top-0 left-0 z-40">
      {/* Sidebar Header */}
      <div className="h-16 flex items-center px-4 border-b-2 border-fwBlack">
        <div className="flex items-center gap-3 w-full">
          <div className="w-8 h-8 bg-fwBlack text-white flex items-center justify-center rounded-lg rotate-3 shadow-sm">
            <span className="font-display text-xl font-bold">P</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1 text-sm font-bold truncate max-w-[120px]">
              panda-store
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Live</span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-fwBlack ml-auto cursor-pointer hover:text-fwPurple transition-colors" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={
                isActive
                  ? "flex items-center gap-3 px-3 py-2.5 text-sm font-bold bg-fwBlack text-white rounded-xl shadow-comic-sm transform translate-x-[-2px] translate-y-[-2px] transition-all"
                  : "flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-gray-500 hover:bg-fwGray hover:text-fwBlack rounded-xl transition-all hover:translate-x-1"
              }
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t-2 border-fwBlack bg-gray-50">
        <div className="text-[10px] font-bold text-gray-400 mb-3 uppercase tracking-widest">Your Shop</div>
        <div className="bg-white border-2 border-fwBlack p-3 rounded-xl shadow-comic-sm flex items-center justify-between cursor-pointer hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all group">
          <span className="text-sm font-bold text-fwBlack">Visit Shop</span>
          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-fwPurple transition-colors" />
        </div>
      </div>
    </aside>
  );
}