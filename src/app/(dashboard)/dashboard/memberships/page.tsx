import Link from "next/link";
import { format } from "date-fns";
import { PlusCircle, Edit, Trash2 } from "lucide-react";

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
import { getMembershipTiers, deleteMembershipTier } from "@/features/memberships/actions";
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


export default async function MembershipTiersPage() {
  const { tiers, error } = await getMembershipTiers();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold text-red-500">Errore</h2>
        <p className="mt-2 text-gray-600">{typeof error === 'string' ? error : "Si è verificato un errore durante il caricamento dei livelli di abbonamento."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Livelli di Abbonamento</h1>
        <Button asChild>
          <Link href="/dashboard/memberships/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuovo Livello
          </Link>
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Prezzo</TableHead>
              <TableHead>Valuta</TableHead>
              <TableHead className="hidden md:table-cell">Vantaggi</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead className="hidden lg:table-cell">Creato Il</TableHead>
              <TableHead className="w-[50px] text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tiers && tiers.length > 0 ? (
              tiers.map((tier) => (
                <TableRow key={tier.id}>
                  <TableCell className="font-medium">{tier.name}</TableCell>
                  <TableCell>
                    €{Number(tier.price).toFixed(2)}
                  </TableCell>
                   <TableCell>{tier.currency}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {tier.benefits && tier.benefits.length > 0
                      ? tier.benefits.join(", ")
                      : "Nessun vantaggio"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={tier.status === "ACTIVE" ? "default" : "secondary"}>
                      {tier.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {format(new Date(tier.createdAt), "dd/MM/yyyy")}
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
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/memberships/${tier.id}/edit`}>
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
                                Questa azione non può essere annullata. Eliminerà permanentemente il livello di abbonamento.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annulla</AlertDialogCancel>
                              <AlertDialogAction onClick={async () => { await deleteMembershipTier(tier.id); }}>
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
                  Nessun livello di abbonamento trovato.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}