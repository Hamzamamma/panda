"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { User, Bell, Search } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden md:pl-64">
        {/* Top Bar */}
        <header className="h-16 flex items-center justify-between px-8 bg-white border-b-2 border-fwBlack sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-2 border-transparent focus:border-fwBlack rounded-lg text-sm font-medium transition-all outline-none"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-px h-6 bg-gray-200 mx-2"></div>
            <button className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="w-8 h-8 bg-fwPurple rounded-lg flex items-center justify-center text-white shadow-sm">
                <User className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-gray-700 hidden sm:block">Creator Admin</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8 bg-[#F9FAFB]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}