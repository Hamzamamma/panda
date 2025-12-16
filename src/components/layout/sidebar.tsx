"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  DollarSign,
  Shirt,
  Tag,
  Star,
  BarChart2,
  Settings,
  ChevronDown,
} from "lucide-react";

const navItems = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Orders", href: "/orders", icon: DollarSign },
  { name: "Products", href: "/products", icon: Shirt },
  { name: "Promotions", href: "/marketing/discounts", icon: Tag },
  { name: "Memberships", href: "/dashboard/memberships", icon: Star },
  { name: "Analytics", href: "/analytics", icon: BarChart2 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-64 flex-col hidden md:flex h-screen fixed left-0 top-0 z-40"
      style={{
        backgroundColor: 'white',
        borderRight: '2px solid #000000'
      }}
    >
      {/* Sidebar Header */}
      <div
        className="h-20 flex items-center px-4"
        style={{ borderBottom: '2px solid #000000' }}
      >
        <div className="flex items-center gap-3 w-full">
          <div
            className="w-8 h-8 text-white flex items-center justify-center rounded-lg rotate-3 shadow-sm shrink-0"
            style={{ backgroundColor: '#000000' }}
          >
            <span className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>P</span>
          </div>

          <div className="flex flex-col overflow-hidden flex-1">
            <div className="text-sm font-bold truncate" style={{ color: '#000000' }}>
              PANDA Dashboard
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Live</span>
            </div>
          </div>

          <ChevronDown className="w-4 h-4 ml-auto cursor-pointer transition-colors" style={{ color: '#000000' }} />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold rounded-lg transition-all"
              style={isActive ? {
                backgroundColor: '#000000',
                color: 'white',
                boxShadow: '2px 2px 0px 0px #000000',
                transform: 'translate(-2px, -2px)'
              } : {
                color: '#4B5563'
              }}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div
        className="p-4 bg-gray-50"
        style={{ borderTop: '2px solid #000000' }}
      >
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide text-center">
          Panda v1.0
        </div>
      </div>
    </aside>
  );
}
