import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, User, MapPin } from "lucide-react";
import Link from "next/link";
import { getShopifyAdminClient } from "@/lib/shopify";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

// Specific query for single order details including address
const GET_ORDER_DETAIL_QUERY = `
  query GetOrder($id: ID!) {
    order(id: $id) {
      id
      name
      createdAt
      email
      displayFinancialStatus
      displayFulfillmentStatus
      totalPriceSet {
        shopMoney { amount currencyCode }
      }
      subtotalPriceSet {
        shopMoney { amount }
      }
      totalShippingPriceSet {
        shopMoney { amount }
      }
      totalTaxSet {
        shopMoney { amount }
      }
      customer {
        firstName
        lastName
        email
      }
      shippingAddress {
        address1
        city
        province
        zip
        country
      }
      lineItems(first: 50) {
        edges {
          node {
            title
            quantity
            variant {
                title
                image { url }
            }
            originalTotalPriceSet {
              shopMoney { amount }
            }
          }
        }
      }
    }
  }
`;

async function getShopifyOrderById(id: string) {
    try {
        // Decode ID if it was encoded in URL
        const decodedId = decodeURIComponent(id);
        const client = await getShopifyAdminClient();
        const { data } = await client.request(GET_ORDER_DETAIL_QUERY, {
            variables: { id: decodedId }
        });
        return data.order;
    } catch (e) {
        console.error("Error fetching order detail:", e);
        return null;
    }
}

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await getShopifyOrderById(params.id);

  if (!order) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <h1 className="text-2xl font-bold mb-4">Ordine non trovato</h1>
            <Button asChild><Link href="/dashboard/orders">Torna agli ordini</Link></Button>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/orders">
                <ArrowLeft className="h-4 w-4" />
            </Link>
        </Button>
        <div>
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">Ordine {order.name}</h1>
                <Badge variant="outline">{format(new Date(order.createdAt), "dd MMMM yyyy, HH:mm")}</Badge>
            </div>
            <div className="flex gap-2 mt-1">
                <Badge className={order.displayFinancialStatus === 'PAID' ? 'bg-green-600' : 'bg-yellow-600'}>
                    {order.displayFinancialStatus}
                </Badge>
                <Badge variant="secondary">
                    {order.displayFulfillmentStatus}
                </Badge>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Order Items */}
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Dettagli Articoli</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Prodotto</TableHead>
                                <TableHead className="text-right">Prezzo</TableHead>
                                <TableHead className="text-right">Qta</TableHead>
                                <TableHead className="text-right">Totale</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.lineItems.edges.map(({ node: item }: any, idx: number) => (
                                <TableRow key={idx}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            {item.variant?.image && (
                                                <img src={item.variant.image.url} className="w-10 h-10 rounded border object-cover" alt="" />
                                            )}
                                            <div>
                                                <div className="font-medium">{item.title}</div>
                                                <div className="text-xs text-muted-foreground">{item.variant?.title !== 'Default Title' ? item.variant?.title : ''}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        €{(Number(item.originalTotalPriceSet.shopMoney.amount) / item.quantity).toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-right">{item.quantity}</TableCell>
                                    <TableCell className="text-right font-medium">
                                        €{Number(item.originalTotalPriceSet.shopMoney.amount).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter className="flex flex-col gap-2 border-t pt-6 bg-gray-50/50">
                    <div className="flex w-full justify-between text-sm">
                        <span className="text-muted-foreground">Subtotale</span>
                        <span>€{Number(order.subtotalPriceSet?.shopMoney?.amount || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex w-full justify-between text-sm">
                        <span className="text-muted-foreground">Spedizione</span>
                        <span>€{Number(order.totalShippingPriceSet?.shopMoney?.amount || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex w-full justify-between text-sm">
                        <span className="text-muted-foreground">Tasse</span>
                        <span>€{Number(order.totalTaxSet?.shopMoney?.amount || 0).toFixed(2)}</span>
                    </div>
                    <Separator className="my-2" />
                     <div className="flex w-full justify-between font-bold text-lg">
                        <span>Totale</span>
                        <span>€{Number(order.totalPriceSet.shopMoney.amount).toFixed(2)}</span>
                    </div>
                </CardFooter>
            </Card>
        </div>

        {/* RIGHT COLUMN: Customer & Shipping */}
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        Cliente
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <div className="font-medium">{order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : 'Guest'}</div>
                        <div className="text-sm text-muted-foreground">{order.email}</div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        Indirizzo di Spedizione
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {order.shippingAddress ? (
                        <div className="text-sm text-gray-600 leading-relaxed">
                            <p>{order.shippingAddress.address1}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.zip}</p>
                            <p>{order.shippingAddress.country}</p>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">Nessun indirizzo fisico (Prodotto Digitale?)</p>
                    )}
                </CardContent>
            </Card>
            
            {order.displayFulfillmentStatus === 'UNFULFILLED' && (
                <Button className="w-full" disabled>
                    Contrassegna come Spedito (WIP)
                </Button>
            )}
        </div>
      </div>
    </div>
  );
}