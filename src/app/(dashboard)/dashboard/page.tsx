"use client";

import { useOrders, useProducts } from "@/hooks/use-medusa";
import { 
  ShoppingBag, 
  Users, 
  DollarSign, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from "lucide-react";
import { format } from "date-fns";

export default function DashboardPage() {
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: products, isLoading: productsLoading } = useProducts();

  const totalSales = orders?.reduce((acc: number, order: any) => acc + (order.total || 0), 0) || 0;
  const totalOrders = orders?.length || 0;
  const totalProducts = products?.length || 0;

  const stats = [
    {
      label: "Total Sales",
      value: `€ ${(totalSales / 100).toFixed(2)}`,
      icon: DollarSign,
      trend: "+12.5%",
      trendUp: true,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      label: "Total Orders",
      value: totalOrders.toString(),
      icon: ShoppingBag,
      trend: "+3.2%",
      trendUp: true,
      color: "text-fwPurple",
      bg: "bg-purple-50"
    },
    {
      label: "Active Products",
      value: totalProducts.toString(),
      icon: TrendingUp,
      trend: "Stable",
      trendUp: true,
      color: "text-blue-600",
      bg: "bg-blue-50"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold text-fwBlack">Overview</h1>
        <p className="text-gray-500 font-medium">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border-2 border-fwBlack p-6 rounded-2xl shadow-comic hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl border-2 border-fwBlack ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
                {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-3xl font-display font-bold text-fwBlack mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border-2 border-fwBlack rounded-2xl shadow-comic overflow-hidden">
        <div className="px-6 py-5 border-b-2 border-fwBlack flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-fwBlack" />
            <h2 className="text-xl font-display font-bold text-fwBlack">Recent Orders</h2>
          </div>
          <button className="text-sm font-bold text-fwPurple hover:underline transition-all">View All Orders</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b-2 border-fwBlack">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-100">
              {ordersLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-4 bg-gray-50/50"></td>
                  </tr>
                ))
              ) : orders && orders.length > 0 ? (
                orders.slice(0, 5).map((order: any) => (
                  <tr key={order.id} className="hover:bg-fwGray transition-colors group">
                    <td className="px-6 py-4 font-mono text-sm font-bold text-fwBlack">#{order.display_id}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-700">{order.customer?.email || "Guest"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border-2 border-fwBlack shadow-comic-sm ${
                        order.status === 'completed' ? 'bg-fwGreen text-fwGreenText' : 
                        order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-500">
                      {format(new Date(order.created_at), "MMM d, HH:mm")}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-bold text-fwBlack">
                      € {(order.total / 100).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <ShoppingBag className="w-12 h-12 text-gray-200" />
                      <p className="text-gray-500 font-bold italic">No orders found yet...</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
