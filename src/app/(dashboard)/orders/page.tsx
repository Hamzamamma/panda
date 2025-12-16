export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Eye, Truck, CheckCircle, AlertCircle, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOrders } from "@/features/orders/actions";

// Helper for status colors
const getFinancialBadge = (status: string) => {
    switch (status) {
        case 'PAID': return <Badge className="bg-green-600 hover:bg-green-700">Paid</Badge>;
        case 'REFUNDED': return <Badge variant="destructive">Refunded</Badge>;
        case 'PENDING': return <Badge variant="secondary" className="text-yellow-600 bg-yellow-100">Pending</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
};

const getFulfillmentBadge = (status: string) => {
    switch (status) {
        case 'FULFILLED': return <Badge className="bg-blue-600 hover:bg-blue-700">Fulfilled</Badge>;
        case 'UNFULFILLED': return <Badge variant="secondary" className="text-orange-600 bg-orange-100">Unfulfilled</Badge>;
        case 'PARTIALLY_FULFILLED': return <Badge className="bg-blue-400">Partial</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
};

export default async function OrdersPage() {
  const { orders, error } = await getOrders();

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
            <h2 className="text-xl font-bold text-red-500">Errore Sincronizzazione</h2>
            <p className="mt-2 text-gray-600">{typeof error === 'string' ? error : "Impossibile caricare gli ordini da Shopify."}</p>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Ordini Shopify</h1>
            <p className="text-muted-foreground">Gestisci i tuoi ordini sincronizzati in tempo reale.</p>
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Ordine #</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead>Spedizione</TableHead>
              <TableHead className="text-right">Totale</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium font-mono">{order.orderNumber}</TableCell>
                  <TableCell>
                    {format(new Date(order.createdAt), "dd/MM/yyyy")}
                    <div className="text-xs text-muted-foreground">{format(new Date(order.createdAt), "HH:mm")}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                        <span className="font-medium">{order.customerName}</span>
                        <span className="text-xs text-muted-foreground">{order.customerEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getFinancialBadge(order.financialStatus)}
                  </TableCell>
                  <TableCell>
                    {getFulfillmentBadge(order.fulfillmentStatus)}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {Number(order.totalPrice).toLocaleString('it-IT', { style: 'currency', currency: order.currency })}
                  </TableCell>
                  <TableCell>
                    {/* Link handling for encoded Shopify ID if needed */}
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/orders/${encodeURIComponent(order.id)}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Dettagli</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Truck className="h-8 w-8 mb-2 opacity-20" />
                        <p>Nessun ordine trovato su Shopify.</p>
                    </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
