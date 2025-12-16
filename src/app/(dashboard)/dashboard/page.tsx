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
const cardStyle = {
  backgroundColor: "white",
  padding: "1.5rem",
  border: "2px solid #000000",
  borderRadius: "0.75rem",
  boxShadow: "4px 4px 0px 0px #000000",
  cursor: "pointer",
  position: "relative" as const,
  overflow: "hidden",
};

const buttonStyle = {
  backgroundColor: "white",
  border: "2px solid #000000",
  boxShadow: "4px 4px 0px 0px #000000",
  borderRadius: "0.5rem",
  padding: "0.5rem 1rem",
  fontWeight: "bold",
  fontSize: "0.875rem",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
};

const buttonBlackStyle = {
  backgroundColor: "#000000",
  color: "white",
  border: "2px solid #000000",
  boxShadow: "4px 4px 0px 0px #000000",
  borderRadius: "9999px",
  padding: "0.625rem 1.25rem",
  fontWeight: "bold",
  fontSize: "0.875rem",
};

export default async function DashboardPage() {
  return (
    <div className="space-y-10">
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
        <div className="flex items-center gap-2">
          <button style={buttonStyle}>
            <Calendar className="w-4 h-4" />
            Last 30 days
          </button>
        </div>

        <div
          className="flex items-center gap-3 text-sm font-medium px-4 py-2 rounded-full shadow-sm"
          style={{ backgroundColor: "white", border: "2px solid #000000" }}
        >
          <span className="truncate max-w-[200px] md:max-w-xs font-mono text-xs">
            panda-dashboard.vercel.app
          </span>
          <div className="h-4 w-px bg-gray-300 mx-1"></div>
          <Copy className="w-3.5 h-3.5 cursor-pointer transition-colors" />
          <Settings2 className="w-3.5 h-3.5 cursor-pointer transition-colors" />
        </div>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat 1: Estimated Profit */}
        <div style={cardStyle} className="group">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <DollarSign className="w-16 h-16 transform rotate-12" />
          </div>
          <div
            className="text-4xl font-black mb-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            €{stats.totalRevenue.toFixed(2)}
          </div>
          <div className="flex items-center text-sm font-bold text-gray-600">
            Estimated profit
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        {/* Stat 2: Orders */}
        <div style={cardStyle} className="group">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ShoppingBag className="w-16 h-16 transform -rotate-12" />
          </div>
          <div
            className="text-4xl font-black mb-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {stats.orderCount}
          </div>
          <div className="flex items-center text-sm font-bold text-gray-600">
            Orders
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        {/* Stat 3: Avg Order Value */}
        <div style={cardStyle} className="group">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp className="w-16 h-16 transform rotate-6" />
          </div>
          <div
            className="text-4xl font-black mb-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            €
            {(stats.orderCount > 0
              ? stats.totalRevenue / stats.orderCount
              : 0
            ).toFixed(2)}
          </div>
          <div className="flex items-center text-sm font-bold text-gray-600">
            Avg. Order Value
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </div>
      {/* Revenue Chart Section */}{" "}
      <div className="grid grid-cols-1 gap-4">
        {" "}
        <div style={cardStyle}>
          {" "}
          <div className="mb-4">
            {" "}
            <h3 className="text-lg font-black font-mono">
              Revenue Overview
            </h3>{" "}
            <p className="text-sm text-gray-500 font-bold">
              Monthly performance
            </p>{" "}
          </div>{" "}
          <div className="pl-2">
            {" "}
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
            />{" "}
          </div>{" "}
        </div>{" "}
      </div>
      {/* Tips / Notifications */}
      <div className="flex items-start gap-4 overflow-x-auto pb-4 pt-1">
        <div
          className="flex-shrink-0 flex items-center gap-4 px-5 py-4 rounded-xl min-w-[320px]"
          style={{
            backgroundColor: "white",
            border: "2px solid #000000",
            boxShadow: "4px 4px 0px 0px #000000",
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm"
            style={{ backgroundColor: "#dcfce7", border: "2px solid #000000" }}
          >
            🚛
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold leading-tight">
              Offer free shipping on orders over €75
            </p>
          </div>
          <button className="text-gray-400 hover:text-black">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div
          className="flex-shrink-0 flex items-center gap-4 px-5 py-4 rounded-xl min-w-[320px]"
          style={{
            backgroundColor: "white",
            border: "2px solid #000000",
            boxShadow: "4px 4px 0px 0px #000000",
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm"
            style={{ backgroundColor: "#dbeafe", border: "2px solid #000000" }}
          >
            📧
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold leading-tight">
              Offer 5% off in checkout abandonment emails
            </p>
          </div>
          <button className="text-gray-400 hover:text-black">
            <X className="w-4 h-4" />
          </button>
        </div>

        <button
          className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl"
          style={{
            backgroundColor: "white",
            border: "2px solid #000000",
            boxShadow: "4px 4px 0px 0px #000000",
            color: "#9D4EDD",
          }}
        >
          <Gem className="w-6 h-6" />
        </button>
      </div>
      {/* Product Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <h2
            className="text-2xl font-black"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Your Products
          </h2>
          <div className="flex gap-3">
            <Link href="/products">
              <button
                className="px-5 py-2.5 text-sm font-bold rounded-full transition-colors"
                style={{
                  backgroundColor: "white",
                  border: "2px solid #000000",
                  boxShadow: "2px 2px 0px 0px #000000",
                }}
              >
                Browse all
              </button>
            </Link>
            <Link href="/products/new">
              <button style={buttonBlackStyle}>Create product</button>
            </Link>
          </div>
        </div>

        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {displayProducts.map((product: any) => (
              <Link
                href={`/products/${encodeURIComponent(product.id)}/edit`}
                key={product.id}
              >
                <div className="group cursor-pointer">
                  <div
                    className="aspect-square rounded-2xl mb-3 overflow-hidden relative"
                    style={{
                      backgroundColor: "white",
                      border: "2px solid transparent",
                    }}
                  >
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    <div
                      className="absolute top-2 right-2 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ backgroundColor: "#000000" }}
                    >
                      EDIT
                    </div>
                  </div>
                  <h3
                    className="text-xs font-bold leading-tight mb-1 group-hover:underline line-clamp-2"
                    style={{ color: "#000000" }}
                  >
                    {product.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    From €{Number(product.price).toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}

            {/* Add New Card */}
            <Link href="/products/new">
              <div className="group cursor-pointer">
                <div
                  className="aspect-square rounded-2xl mb-3 overflow-hidden flex items-center justify-center"
                  style={{
                    backgroundColor: "white",
                    border: "2px dashed #d1d5db",
                  }}
                >
                  <div className="text-center">
                    <div
                      className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center transition-colors"
                      style={{ backgroundColor: "#f3f4f6" }}
                    >
                      <Plus className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-gray-500">
                      Add New
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ) : (
          <div
            className="text-center py-16 rounded-2xl"
            style={{ backgroundColor: "white", border: "2px dashed #000000" }}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-bold mb-4">
              You haven't created any products yet.
            </p>
            <Link href="/products/new">
              <button style={buttonBlackStyle}>
                Create your first product
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
