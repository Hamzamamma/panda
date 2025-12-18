"use client";

import { useOrders } from "@/hooks/use-medusa";
import { 
  FileText, 
  Search, 
  Filter,
  Download,
  MoreHorizontal,
  Mail,
  Calendar
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default function OrdersPage() {
  const { data: orders, isLoading } = useOrders();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-display font-bold text-fwBlack">Orders</h1>
          <p className="text-gray-500 font-medium">Manage and track your customer's orders.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-fwBlack rounded-xl font-bold shadow-comic hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-fwGreen border-2 border-fwBlack p-4 rounded-2xl shadow-comic-sm">
          <p className="text-[10px] font-bold text-fwGreenText uppercase tracking-widest">Completed</p>
          <p className="text-2xl font-display font-bold text-fwGreenText mt-1">
            {orders?.filter((o: any) => o.status === 'completed').length || 0}
          </p>
        </div>
        <div className="bg-amber-50 border-2 border-fwBlack p-4 rounded-2xl shadow-comic-sm">
          <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Pending</p>
          <p className="text-2xl font-display font-bold text-amber-700 mt-1">
            {orders?.filter((o: any) => o.status === 'pending').length || 0}
          </p>
        </div>
        <div className="bg-blue-50 border-2 border-fwBlack p-4 rounded-2xl shadow-comic-sm">
          <p className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">Total Value</p>
          <p className="text-2xl font-display font-bold text-blue-700 mt-1">
            € {((orders?.reduce((acc: number, o: any) => acc + (o.total || 0), 0) || 0) / 100).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border-2 border-fwBlack rounded-2xl shadow-comic overflow-hidden">
        {/* Table Filters */}
        <div className="p-4 border-b-2 border-fwBlack bg-gray-50 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by order ID, email, or customer..." 
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-fwBlack rounded-xl text-sm font-bold shadow-comic-sm focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-3 bg-white border-2 border-fwBlack rounded-xl font-bold shadow-comic-sm hover:bg-gray-50">
              <Calendar className="w-5 h-5" />
              Date
            </button>
            <button className="flex items-center gap-2 px-4 py-3 bg-white border-2 border-fwBlack rounded-xl font-bold shadow-comic-sm hover:bg-gray-50">
              <Filter className="w-5 h-5" />
              Status
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b-2 border-fwBlack">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Fulfillment</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Total</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="px-6 py-8 bg-gray-50/50"></td>
                  </tr>
                ))
              ) : orders && orders.length > 0 ? (
                orders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-fwGray transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <p className="font-mono text-sm font-bold text-fwBlack">#{order.display_id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-fwBlack">{order.customer?.first_name} {order.customer?.last_name}</span>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Mail className="w-3 h-3" />
                          {order.customer?.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-500">
                      {format(new Date(order.created_at), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border-2 border-fwBlack shadow-comic-sm ${
                        order.fulfillment_status === 'fulfilled' ? 'bg-fwGreen text-fwGreenText' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {order.fulfillment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border-2 border-fwBlack shadow-comic-sm ${
                        order.payment_status === 'captured' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-bold text-fwBlack">€ {(order.total / 100).toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-white border-2 border-transparent hover:border-fwBlack rounded-lg transition-all">
                        <MoreHorizontal className="w-5 h-5 text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <FileText className="w-16 h-16 text-gray-200" />
                      <div>
                        <p className="text-xl font-display font-bold text-gray-400">No orders found</p>
                        <p className="text-gray-400 font-medium mt-1">When customers buy from your store, their orders will appear here.</p>
                      </div>
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
