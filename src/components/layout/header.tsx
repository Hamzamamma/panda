"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Plus, MessageSquare, Home, DollarSign, Shirt, Tag, Star, BarChart2, Settings } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Orders", href: "/orders", icon: DollarSign },
  { name: "Products", href: "/products", icon: Shirt },
  { name: "Promotions", href: "/marketing/discounts", icon: Tag },
  { name: "Memberships", href: "/dashboard/memberships", icon: Star },
  { name: "Analytics", href: "/analytics", icon: BarChart2 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header
      className="h-20 flex items-center justify-between px-6 md:px-8 backdrop-blur-sm sticky top-0 z-30 w-full"
      style={{
        borderBottom: '2px solid #000000',
        backgroundColor: 'rgba(255, 255, 255, 0.9)'
      }}
    >

      {/* Mobile Menu */}
      <div className="md:hidden flex items-center gap-3">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-fwBlack">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[260px] p-0 bg-white border-r-2 border-fwBlack">
            <div className="flex h-20 items-center border-b-2 border-fwBlack px-4">
              <div className="w-8 h-8 bg-fwBlack text-white flex items-center justify-center rounded-lg rotate-3 shadow-sm mr-3">
                <span className="font-display text-lg font-bold">P</span>
              </div>
              <span className="font-bold text-fwBlack">PANDA</span>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 text-sm font-bold rounded-lg transition-all",
                      isActive
                        ? "bg-fwBlack text-white shadow-comic-sm"
                        : "text-gray-600 hover:bg-fwGray hover:text-fwBlack"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>

        <div className="w-8 h-8 bg-fwBlack text-white flex items-center justify-center rounded-lg rotate-3 shadow-sm">
          <span className="font-display text-xl font-bold">P</span>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4 ml-auto">
        <Link href="/products/new">
          <button
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all"
            style={{
              backgroundColor: 'white',
              border: '2px solid #000000',
              boxShadow: '4px 4px 0px 0px #000000'
            }}
          >
            <Plus className="w-4 h-4" /> Create
          </button>
        </Link>

        <button className="p-2 rounded-full hover:bg-white transition-all" style={{ color: '#000000' }}>
          <MessageSquare className="w-5 h-5" />
        </button>

        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm cursor-pointer"
          style={{
            background: 'linear-gradient(to bottom right, #9D4EDD, #FF006E)',
            border: '2px solid #000000'
          }}
        >
          H
        </div>
      </div>
    </header>
  );
}
