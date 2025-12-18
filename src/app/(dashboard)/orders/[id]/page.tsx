"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { medusaClient } from "@/lib/medusa-client";
import {
  ArrowLeft,
  Package,
  Truck,
  CreditCard,
  User,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Clock,
  FileText,
  MoreHorizontal,
  Copy,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

function useOrder(id: string) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const { order } = await medusaClient.orders.retrieve(id);
      return order;
    },
    enabled: !!id,
  });
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const { data: order, isLoading, error } = useOrder(orderId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
            <div className="h-48 bg-gray-200 rounded-2xl animate-pulse" />
          </div>
          <div className="space-y-6">
            <div className="h-48 bg-gray-200 rounded-2xl animate-pulse" />
            <div className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <XCircle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-xl font-bold text-gray-600">Order not found</h2>
        <p className="text-gray-400 mt-2">The order you're looking for doesn't exist.</p>
        <Link href="/orders" className="mt-6 px-6 py-3 bg-fwBlack text-white rounded-xl font-bold">
          Back to Orders
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'fulfilled':
      case 'captured':
        return 'bg-fwGreen text-fwGreenText';
      case 'pending':
      case 'awaiting':
        return 'bg-amber-100 text-amber-700';
      case 'canceled':
      case 'refunded':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-display font-bold text-fwBlack">
              Order #{order.display_id}
            </h1>
            <button
              onClick={() => navigator.clipboard.writeText(order.id)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Copy ID"
            >
              <Copy className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {format(new Date(order.created_at), "MMMM d, yyyy 'at' HH:mm")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase border-2 border-fwBlack shadow-comic-sm ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Card */}
          <div className="bg-white border-2 border-fwBlack rounded-2xl shadow-comic overflow-hidden">
            <div className="px-6 py-4 border-b-2 border-fwBlack bg-gray-50 flex items-center gap-2">
              <Package className="w-5 h-5" />
              <h2 className="font-display font-bold text-fwBlack">Summary</h2>
            </div>
            <div className="p-6">
              <table className="w-full">
                <thead>
                  <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <th className="text-left pb-4">Product</th>
                    <th className="text-center pb-4">Quantity</th>
                    <th className="text-right pb-4">Price</th>
                    <th className="text-right pb-4">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.items?.map((item: any) => (
                    <tr key={item.id}>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-fwGray rounded-lg border-2 border-fwBlack flex items-center justify-center overflow-hidden">
                            {item.thumbnail ? (
                              <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                              <Package className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-fwBlack">{item.title}</p>
                            {item.variant?.title && (
                              <p className="text-xs text-gray-500">{item.variant.title}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-center font-bold">{item.quantity}</td>
                      <td className="py-4 text-right text-gray-600">
                        {order.currency_code?.toUpperCase()} {(item.unit_price / 100).toFixed(2)}
                      </td>
                      <td className="py-4 text-right font-bold text-fwBlack">
                        {order.currency_code?.toUpperCase()} {((item.unit_price * item.quantity) / 100).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="mt-6 pt-6 border-t-2 border-gray-100 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-bold">{order.currency_code?.toUpperCase()} {(order.subtotal / 100).toFixed(2)}</span>
                </div>
                {order.shipping_total > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-bold">{order.currency_code?.toUpperCase()} {(order.shipping_total / 100).toFixed(2)}</span>
                  </div>
                )}
                {order.discount_total > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span className="font-bold">-{order.currency_code?.toUpperCase()} {(order.discount_total / 100).toFixed(2)}</span>
                  </div>
                )}
                {order.tax_total > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax</span>
                    <span className="font-bold">{order.currency_code?.toUpperCase()} {(order.tax_total / 100).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg pt-4 border-t border-gray-100">
                  <span className="font-bold text-fwBlack">Total</span>
                  <span className="font-display font-bold text-fwPurple">
                    {order.currency_code?.toUpperCase()} {(order.total / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Fulfillment Card */}
          <div className="bg-white border-2 border-fwBlack rounded-2xl shadow-comic overflow-hidden">
            <div className="px-6 py-4 border-b-2 border-fwBlack bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                <h2 className="font-display font-bold text-fwBlack">Fulfillment</h2>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border-2 border-fwBlack shadow-comic-sm ${getStatusColor(order.fulfillment_status)}`}>
                {order.fulfillment_status || 'not_fulfilled'}
              </span>
            </div>
            <div className="p-6">
              {order.fulfillments && order.fulfillments.length > 0 ? (
                <div className="space-y-4">
                  {order.fulfillments.map((fulfillment: any, index: number) => (
                    <div key={fulfillment.id} className="p-4 bg-fwGray rounded-xl border-2 border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold">Fulfillment #{index + 1}</span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(fulfillment.created_at), "MMM d, yyyy")}
                        </span>
                      </div>
                      {fulfillment.tracking_numbers?.length > 0 && (
                        <p className="text-sm text-gray-600">
                          Tracking: {fulfillment.tracking_numbers.join(", ")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Truck className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="font-medium">No fulfillments yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Card */}
          <div className="bg-white border-2 border-fwBlack rounded-2xl shadow-comic overflow-hidden">
            <div className="px-6 py-4 border-b-2 border-fwBlack bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                <h2 className="font-display font-bold text-fwBlack">Payment</h2>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border-2 border-fwBlack shadow-comic-sm ${getStatusColor(order.payment_status)}`}>
                {order.payment_status || 'not_paid'}
              </span>
            </div>
            <div className="p-6">
              {order.payments && order.payments.length > 0 ? (
                <div className="space-y-4">
                  {order.payments.map((payment: any) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 bg-fwGray rounded-xl border-2 border-gray-200">
                      <div>
                        <p className="font-bold capitalize">{payment.provider_id}</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(payment.created_at), "MMM d, yyyy 'at' HH:mm")}
                        </p>
                      </div>
                      <p className="font-bold text-fwBlack">
                        {order.currency_code?.toUpperCase()} {(payment.amount / 100).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="font-medium">No payments recorded</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Customer & Shipping */}
        <div className="space-y-6">
          {/* Customer Card */}
          <div className="bg-white border-2 border-fwBlack rounded-2xl shadow-comic overflow-hidden">
            <div className="px-6 py-4 border-b-2 border-fwBlack bg-gray-50 flex items-center gap-2">
              <User className="w-5 h-5" />
              <h2 className="font-display font-bold text-fwBlack">Customer</h2>
            </div>
            <div className="p-6 space-y-4">
              {order.customer ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-fwPurple rounded-full flex items-center justify-center text-white font-bold">
                      {order.customer.first_name?.[0] || order.customer.email?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="font-bold text-fwBlack">
                        {order.customer.first_name} {order.customer.last_name}
                      </p>
                      <p className="text-xs text-gray-500">Customer</p>
                    </div>
                  </div>
                  <div className="space-y-2 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{order.customer.email || order.email}</span>
                    </div>
                    {order.customer.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{order.customer.phone}</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-4 text-gray-400">
                  <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Guest checkout</p>
                  {order.email && (
                    <p className="text-sm text-gray-600 mt-1">{order.email}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="bg-white border-2 border-fwBlack rounded-2xl shadow-comic overflow-hidden">
            <div className="px-6 py-4 border-b-2 border-fwBlack bg-gray-50 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <h2 className="font-display font-bold text-fwBlack">Shipping Address</h2>
            </div>
            <div className="p-6">
              {order.shipping_address ? (
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-bold text-fwBlack">
                    {order.shipping_address.first_name} {order.shipping_address.last_name}
                  </p>
                  {order.shipping_address.company && (
                    <p>{order.shipping_address.company}</p>
                  )}
                  <p>{order.shipping_address.address_1}</p>
                  {order.shipping_address.address_2 && (
                    <p>{order.shipping_address.address_2}</p>
                  )}
                  <p>
                    {order.shipping_address.city}, {order.shipping_address.province} {order.shipping_address.postal_code}
                  </p>
                  <p>{order.shipping_address.country_code?.toUpperCase()}</p>
                  {order.shipping_address.phone && (
                    <p className="pt-2">{order.shipping_address.phone}</p>
                  )}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-400">
                  <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No shipping address</p>
                </div>
              )}
            </div>
          </div>

          {/* Billing Address Card */}
          {order.billing_address && (
            <div className="bg-white border-2 border-fwBlack rounded-2xl shadow-comic overflow-hidden">
              <div className="px-6 py-4 border-b-2 border-fwBlack bg-gray-50 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <h2 className="font-display font-bold text-fwBlack">Billing Address</h2>
              </div>
              <div className="p-6">
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-bold text-fwBlack">
                    {order.billing_address.first_name} {order.billing_address.last_name}
                  </p>
                  {order.billing_address.company && (
                    <p>{order.billing_address.company}</p>
                  )}
                  <p>{order.billing_address.address_1}</p>
                  {order.billing_address.address_2 && (
                    <p>{order.billing_address.address_2}</p>
                  )}
                  <p>
                    {order.billing_address.city}, {order.billing_address.province} {order.billing_address.postal_code}
                  </p>
                  <p>{order.billing_address.country_code?.toUpperCase()}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
