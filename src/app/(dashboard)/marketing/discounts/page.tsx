import { PlusCircle, Tag } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import { getDiscounts } from "@/features/marketing/actions";
import { DiscountForm } from "@/features/marketing/components/discount-form";
import { DiscountToggle } from "@/features/marketing/components/discount-toggle"; 

export default async function DiscountsPage() {
  const { discounts, error } = await getDiscounts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Marketing & Sconti</h1>
            <p className="text-muted-foreground">Gestisci i codici promozionali per i tuoi clienti.</p>
        </div>
        
        <Sheet>
            <SheetTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nuovo Sconto
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Crea Codice Sconto</SheetTitle>
                    <SheetDescription>
                        Configura un nuovo codice promozionale.
                    </SheetDescription>
                </SheetHeader>
                <div className="py-6">
                    <DiscountForm /> 
                </div>
            </SheetContent>
        </Sheet>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Codice</TableHead>
              <TableHead>Valore</TableHead>
              <TableHead>Utilizzi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Scadenza</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {discounts && discounts.length > 0 ? (
              discounts.map((discount) => (
                <TableRow key={discount.id}>
                  <TableCell className="font-mono font-bold flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    {discount.code}
                  </TableCell>
                  <TableCell>
                    {discount.type === 'PERCENTAGE' ? `${Number(discount.value)}%` : `€${Number(discount.value).toFixed(2)}`}
                  </TableCell>
                  <TableCell>
                    {discount.uses} 
                    {discount.maxUses ? ` / ${discount.maxUses}` : ''}
                  </TableCell>
                  <TableCell>
                    <DiscountToggle id={discount.id} active={discount.active} />
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {discount.expiresAt ? format(new Date(discount.expiresAt), "dd/MM/yyyy") : "Mai"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nessun codice sconto attivo.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}