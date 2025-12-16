export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Link from "next/link";
import {
  Calendar,
  Copy,
  Settings2,
  ArrowRight,
  X,
  Gem,
  Plus,
  DollarSign,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";

import { getDashboardStats, getGraphRevenue } from "@/features/analytics/actions";
import { getProducts } from "@/features/products/actions";
import { DashboardStatsSkeleton } from "@/components/skeletons/dashboard-stats-skeleton";

import { Overview } from "@/components/dashboard/overview";

export default async function DashboardPage() {
  return (
    <div className="space-y-8 p-8 bg-fwCream min-h-screen text-fwBlack">
      <Suspense fallback={<DashboardStatsSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}

async function DashboardContent() {
  const [stats, graphData] = await Promise.all([getDashboardStats(), getGraphRevenue()]);
  const { products } = await getProducts();
  const displayProducts = products?.slice(0, 5) || [];

  return (
    <>
      {/* Dashboard Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h1 className="text-4xl font-display font-black">Dashboard</h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white px-4 py-2 border-2 border-fwBlack rounded-lg shadow-comic-sm cursor-pointer hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
            <Calendar className="w-4 h-4" />
            <span className="font-bold text-sm">Last 30 days</span>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 bg-white border-2 border-fwBlack rounded-full shadow-comic-sm">
            <span className="truncate max-w-[150px] font-mono text-xs font-bold">
              panda-dashboard.vercel.app
            </span>
            <div className="h-4 w-0.5 bg-fwBlack mx-1"></div>
            <Copy className="w-3.5 h-3.5 cursor-pointer hover:text-fwPurple transition-colors" />
            <Settings2 className="w-3.5 h-3.5 cursor-pointer hover:text-fwPurple transition-colors" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat 1: Estimated Profit */}
        <div className="bg-white border-2 border-fwBlack p-6 rounded-xl shadow-comic hover:shadow-comic-hover transition-all relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <DollarSign className="w-24 h-24 rotate-12" />
          </div>
          <div className="text-sm font-bold text-gray-500 mb-1 uppercase tracking-wider">Estimated Profit</div>
          <div className="text-4xl font-display font-black text-fwBlack mb-4">
            €{stats.totalRevenue.toFixed(2)}
          </div>
          <div className="flex items-center text-xs font-bold text-fwGreenText bg-fwGreen py-1 px-2 rounded w-fit">
            +12.5% <ArrowRight className="w-3 h-3 ml-1" />
          </div>
        </div>

        {/* Stat 2: Orders */}
        <div className="bg-white border-2 border-fwBlack p-6 rounded-xl shadow-comic hover:shadow-comic-hover transition-all relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <ShoppingBag className="w-24 h-24 -rotate-12" />
          </div>
          <div className="text-sm font-bold text-gray-500 mb-1 uppercase tracking-wider">Total Orders</div>
          <div className="text-4xl font-display font-black text-fwBlack mb-4">
            {stats.orderCount}
          </div>
          <div className="flex items-center text-xs font-bold text-fwBlack bg-gray-100 py-1 px-2 rounded w-fit">
            Processing: 4
          </div>
        </div>

        {/* Stat 3: Avg Order Value */}
        <div className="bg-white border-2 border-fwBlack p-6 rounded-xl shadow-comic hover:shadow-comic-hover transition-all relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp className="w-24 h-24 rotate-6" />
          </div>
          <div className="text-sm font-bold text-gray-500 mb-1 uppercase tracking-wider">Avg. Order Value</div>
          <div className="text-4xl font-display font-black text-fwBlack mb-4">
            €{(stats.orderCount > 0 ? stats.totalRevenue / stats.orderCount : 0).toFixed(2)}
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-fwPurple w-[70%]"></div>
          </div>
        </div>
      </div>

      {/* Revenue Chart Section */}
      <div className="bg-white border-2 border-fwBlack p-6 rounded-xl shadow-comic">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-display font-black">Revenue Overview</h3>
            <p className="text-sm text-gray-500 font-medium">Monthly performance analytics</p>
          </div>
          <div className="bg-fwGray px-3 py-1 rounded border-2 border-fwBlack text-xs font-bold">
            2024
          </div>
        </div>
        <div className="h-[350px] w-full">
          <Overview
            data={
              graphData.length > 0 ? graphData : [
                { name: "Jan", total: 1200 },
                { name: "Feb", total: 900 },
                { name: "Mar", total: 1500 },
                { name: "Apr", total: 1100 },
                { name: "May", total: 1800 },
                { name: "Jun", total: 2100 },
              ]
            }
          />
        </div>
      </div>

      {/* Tips / Notifications */}
      <div className="flex items-start gap-4 overflow-x-auto pb-4 pt-2">
        <div className="flex-shrink-0 flex items-center gap-4 px-5 py-4 bg-white border-2 border-fwBlack rounded-xl shadow-comic-sm min-w-[320px]">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-fwGreen border-2 border-fwBlack shadow-sm">
            🚛
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold leading-tight">Offer free shipping on orders over €75</p>
          </div>
          <button className="text-gray-400 hover:text-fwBlack transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-shrink-0 flex items-center gap-4 px-5 py-4 bg-white border-2 border-fwBlack rounded-xl shadow-comic-sm min-w-[320px]">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-blue-100 border-2 border-fwBlack shadow-sm">
            📧
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold leading-tight">Recover 15% more carts with email automation</p>
          </div>
          <button className="text-gray-400 hover:text-fwBlack transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <button className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-fwPurple text-white border-2 border-fwBlack rounded-xl shadow-comic-sm hover:translate-y-1 hover:shadow-none transition-all">
          <Gem className="w-6 h-6" />
        </button>
      </div>

      {/* Product Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl font-display font-black">Your Products</h2>
          <div className="flex gap-3">
            <Link href="/products">
              <button className="px-5 py-2.5 text-sm font-bold rounded-lg border-2 border-fwBlack bg-white hover:bg-gray-50 transition-all shadow-comic-sm active:translate-y-1 active:shadow-none">
                Browse all
              </button>
            </Link>
            <Link href="/products/new">
              <button className="px-5 py-2.5 text-sm font-bold rounded-lg border-2 border-fwBlack bg-fwBlack text-white hover:bg-gray-800 transition-all shadow-comic-sm active:translate-y-1 active:shadow-none flex items-center gap-2">
                <Plus className="w-4 h-4" /> Create product
              </button>
            </Link>
          </div>
        </div>

        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {displayProducts.map((product: any) => (
              <Link href={`/products/${encodeURIComponent(product.id)}/edit`} key={product.id}>
                <div className="group cursor-pointer bg-white border-2 border-fwBlack rounded-xl p-3 shadow-comic hover:shadow-comic-hover transition-all">
                  <div className="aspect-square rounded-lg mb-3 overflow-hidden relative border-2 border-fwBlack bg-gray-50">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 font-mono text-xs">
                        NO IMAGE
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-fwPurple text-white text-[10px] font-black px-2 py-1 border-2 border-fwBlack rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      EDIT
                    </div>
                  </div>
                  <h3 className="text-sm font-bold leading-tight mb-1 group-hover:text-fwPurple transition-colors line-clamp-2">
                    {product.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-mono font-medium">
                    €{Number(product.price).toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}

            {/* Add New Card */}
            <Link href="/products/new">
              <div className="group cursor-pointer h-full min-h-[240px] bg-white border-2 border-dashed border-gray-300 hover:border-fwPurple rounded-xl p-3 flex flex-col items-center justify-center transition-colors">
                <div className="w-12 h-12 mb-3 rounded-full bg-fwGray flex items-center justify-center border-2 border-transparent group-hover:border-fwPurple group-hover:bg-purple-50 transition-all">
                  <Plus className="w-6 h-6 text-gray-400 group-hover:text-fwPurple" />
                </div>
                <span className="text-sm font-bold text-gray-500 group-hover:text-fwPurple">Add New</span>
              </div>
            </Link>
          </div>
        ) : (
          <div className="text-center py-16 rounded-xl border-2 border-dashed border-fwBlack bg-white">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-fwCream border-2 border-fwBlack flex items-center justify-center shadow-comic-sm">
              <Plus className="w-8 h-8 text-fwBlack" />
            </div>
            <p className="text-fwBlack font-bold mb-4 text-lg">You haven't created any products yet.</p>
            <Link href="/products/new">
              <button className="px-6 py-3 text-sm font-bold rounded-lg border-2 border-fwBlack bg-fwPurple text-white hover:bg-opacity-90 transition-all shadow-comic active:translate-y-1 active:shadow-none">
                Create your first product
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}