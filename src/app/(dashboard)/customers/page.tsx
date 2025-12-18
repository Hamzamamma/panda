"use client";

import { useCustomers } from "@/hooks/use-medusa";
import {
  Users,
  Search,
  Filter,
  Mail,
  Phone,
  ShoppingBag,
  Calendar,
  MoreHorizontal,
  UserPlus,
  ChevronRight
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default function CustomersPage() {
  const { data: customers, isLoading } = useCustomers();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-display font-bold text-fwBlack">Customers</h1>
          <p className="text-gray-500 font-medium">View and manage your store's customers.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-fwBlack text-white rounded-xl font-bold shadow-comic hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
          <UserPlus className="w-5 h-5" />
          Add Customer
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-fwPurple/10 border-2 border-fwBlack p-4 rounded-2xl shadow-comic-sm">
          <p className="text-[10px] font-bold text-fwPurple uppercase tracking-widest">Total Customers</p>
          <p className="text-2xl font-display font-bold text-fwPurple mt-1">
            {customers?.length || 0}
          </p>
        </div>
        <div className="bg-fwGreen border-2 border-fwBlack p-4 rounded-2xl shadow-comic-sm">
          <p className="text-[10px] font-bold text-fwGreenText uppercase tracking-widest">With Orders</p>
          <p className="text-2xl font-display font-bold text-fwGreenText mt-1">
            {customers?.filter((c: any) => c.orders && c.orders.length > 0).length || 0}
          </p>
        </div>
        <div className="bg-blue-50 border-2 border-fwBlack p-4 rounded-2xl shadow-comic-sm">
          <p className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">New This Month</p>
          <p className="text-2xl font-display font-bold text-blue-700 mt-1">
            {customers?.filter((c: any) => {
              const created = new Date(c.created_at);
              const now = new Date();
              return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
            }).length || 0}
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
              placeholder="Search by name, email, or phone..."
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-fwBlack rounded-xl text-sm font-bold shadow-comic-sm focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-3 bg-white border-2 border-fwBlack rounded-xl font-bold shadow-comic-sm hover:bg-gray-50">
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b-2 border-fwBlack">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-8 bg-gray-50/50"></td>
                  </tr>
                ))
              ) : customers && customers.length > 0 ? (
                customers.map((customer: any) => (
                  <Link
                    key={customer.id}
                    href={`/customers/${customer.id}`}
                    className="table-row hover:bg-fwGray transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-fwPurple rounded-full flex items-center justify-center text-white font-bold border-2 border-fwBlack">
                          {customer.first_name?.[0]?.toUpperCase() || customer.email?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-bold text-fwBlack">
                            {customer.first_name || customer.last_name
                              ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim()
                              : 'Guest'}
                          </p>
                          {customer.has_account && (
                            <span className="text-[10px] font-bold text-fwPurple uppercase">Has Account</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-3 h-3 text-gray-400" />
                          {customer.email}
                        </div>
                        {customer.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-3 h-3 text-gray-400" />
                            {customer.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-gray-400" />
                        <span className="font-bold text-fwBlack">{customer.orders?.length || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {format(new Date(customer.created_at), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ChevronRight className="w-5 h-5 text-gray-300" />
                    </td>
                  </Link>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Users className="w-16 h-16 text-gray-200" />
                      <div>
                        <p className="text-xl font-display font-bold text-gray-400">No customers yet</p>
                        <p className="text-gray-400 font-medium mt-1">When customers create accounts or place orders, they'll appear here.</p>
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
