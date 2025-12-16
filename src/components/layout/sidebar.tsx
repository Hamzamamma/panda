"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, DollarSign, Shirt, Tag, Star, BarChart2, Settings, ChevronDown, ExternalLink } from "lucide-react";

const navigation = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Orders", href: "/orders", icon: DollarSign },
  { name: "Products", href: "/products", icon: Shirt },
  { name: "Marketing", href: "/marketing/newsletter", icon: Tag },
  { name: "Memberships", href: "/dashboard/memberships", icon: Star },
  { name: "Finances", href: "/finances", icon: BarChart2 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r-2 border-fwBlack bg-white flex-col hidden md:flex h-screen sticky top-0">
      <div className="h-20 flex items-center px-4 border-b-2 border-fwBlack">
        <div className="flex items-center gap-3 w-full">
          <div className="w-8 h-8 bg-fwBlack text-white flex items-center justify-center rounded-lg rotate-3 shadow-sm">
            <span className="font-display text-xl font-bold">P</span>
          </div>
          <span className="font-display font-bold text-lg tracking-tight">PANDA</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all border-2 ${
                isActive
                  ? "bg-fwBlack text-white border-fwBlack shadow-comic-sm translate-x-[2px] translate-y-[2px]"
                  : "text-gray-600 border-transparent hover:bg-fwGray hover:border-fwBlack hover:text-fwBlack"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-fwPurple" : ""}`} />
              <span className="font-bold text-sm">{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t-2 border-fwBlack bg-fwGray">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-fwPurple border-2 border-fwBlack"></div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold truncate">Hamza Creator</p>
            <p className="text-[10px] text-gray-500 truncate">hamza@panda.com</p>
          </div>
          <Settings className="w-4 h-4 cursor-pointer hover:text-fwPurple transition-colors" />
        </div>
      </div>
    </aside>
  );
}