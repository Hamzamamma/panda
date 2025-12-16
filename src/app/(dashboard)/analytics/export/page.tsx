"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateCsvExport } from "@/features/analytics/actions";
import { Download, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function AnalyticsExportPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleExport() {
    setLoading(true);
    const result = await generateCsvExport();
    setLoading(false);

    if (result.success && result.csvContent) {
        // Create a blob and trigger download
        const blob = new Blob([result.csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', result.filename || 'export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({ title: "Export Completato", description: "Il download dovrebbe iniziare automaticamente." });
    } else {
        toast({ title: "Errore", description: "Impossibile generare il file CSV.", variant: "destructive" });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Esporta Dati</h1>
        <p className="text-muted-foreground">Scarica i dati dei tuoi ordini in formato CSV.</p>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Ordini Completi</CardTitle>
            <CardDescription>
                Esporta tutti gli ordini con dettagli cliente, prodotti e stato. Utile per contabilità o analisi esterne.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Button onClick={handleExport} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                Scarica CSV
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
