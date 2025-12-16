import Link from "next/link";
import { format } from "date-fns";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
export const dynamic = 'force-dynamic';

import { Suspense } from "react";

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
import { getProducts, deleteProduct } from "@/features/products/actions";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { ProductTableSkeleton } from "@/components/skeletons/product-table-skeleton";
import { ApiErrorAlert } from "@/components/alerts/api-error-alert";

export default function ProductsPageWrapper() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Prodotti Shopify</h1>
                <Button asChild>
                <Link href="/dashboard/products/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nuovo Prodotto
                </Link>
                </Button>
            </div>
            
            <Suspense fallback={<ProductTableSkeleton />}>
                <ProductsList />
            </Suspense>
        </div>
    );
}

async function ProductsList() {
  const { products, error } = await getProducts();

  if (error) {
    return <ApiErrorAlert error={error} />;
  }

  return (
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px] hidden sm:table-cell">Immagine</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead>Prezzo</TableHead>
              <TableHead className="hidden md:table-cell">Inventario</TableHead>
              <TableHead className="hidden lg:table-cell">Creato Il</TableHead>
              <TableHead className="w-[50px] text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products && products.length > 0 ? (
              products.map((product: any) => (
                <TableRow key={product.id}>
                  <TableCell className="hidden sm:table-cell">
                    {product.images && product.images.length > 0 ? (
                      <img
                        alt="Product image"
                        className="aspect-square rounded-md object-cover border"
                        height="48"
                        src={product.images[0]}
                        width="48"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-100 text-gray-400 text-xs">
                        No Img
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{product.title}</TableCell>
                  <TableCell>
                    <Badge variant={product.status === "ACTIVE" ? "default" : "secondary"}>
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {/* Shopify returns price as string usually */}
                    €{Number(product.price).toFixed(2)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{product.inventory || 0}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {format(new Date(product.createdAt), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Azioni</DropdownMenuLabel>
                        {/* Note: Edit link might need adjustment if using Shopify ID directly in URL due to encoding */}
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/products/${encodeURIComponent(product.id)}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifica
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Elimina
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Sei assolutamente sicuro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Questa azione eliminerà il prodotto dal tuo store Shopify.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annulla</AlertDialogCancel>
                              <AlertDialogAction onClick={async () => { 
                                  "use server";
                                  await deleteProduct(product.id); 
                              }}>
                                Elimina
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nessun prodotto trovato su Shopify.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
  );
}
