import { format } from "date-fns";
import { getFinancialData } from "@/features/finances/actions";
import { RequestPayoutDialog } from "@/features/finances/components/request-payout-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Landmark, Clock, ArrowUpRight } from "lucide-react";

export default async function FinancesPage() {
  const { balance, payouts, totalPaid } = await getFinancialData();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Finanze</h1>
            <p className="text-muted-foreground">Monitora i tuoi guadagni da Shopify e richiedi pagamenti.</p>
        </div>
        <RequestPayoutDialog maxAmount={Number(balance.availableAmount)} />
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-green-100 bg-green-50/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Saldo Disponibile</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">€{Number(balance.availableAmount).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Calcolato sulle vendite nette</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Attesa</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{Number(balance.pendingAmount).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Ordini in elaborazione</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totale Prelevato</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{Number(totalPaid).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Storico erogazioni</p>
          </CardContent>
        </Card>
      </div>

      {/* PAYOUT HISTORY */}
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Landmark className="h-5 w-5 text-muted-foreground" />
                Cronologia Pagamenti
            </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="pl-6">Data Richiesta</TableHead>
                <TableHead>Metodo</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead className="text-right pr-6">Importo</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {payouts && payouts.length > 0 ? (
                payouts.map((payout: any) => (
                    <TableRow key={payout.id}>
                    <TableCell className="pl-6 font-medium">
                        {format(new Date(payout.createdAt), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>{payout.method === 'BANK_TRANSFER' ? 'Bonifico Bancario' : 'PayPal'}</TableCell>
                    <TableCell>
                        <Badge variant={payout.status === 'PAID' ? 'default' : payout.status === 'REJECTED' ? 'destructive' : 'secondary'}>
                            {payout.status === 'REQUESTED' ? 'In Revisione' : payout.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6 font-bold">€{Number(payout.amount).toFixed(2)}</TableCell>
                    </TableRow>
                ))
                ) : (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    Nessun pagamento richiesto finora.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
