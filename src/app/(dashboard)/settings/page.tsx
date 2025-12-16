import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CheckCircle, ExternalLink } from "lucide-react";

export default async function SettingsPage() {
  // Read from environment - these are configured by admin, not editable by creator
  const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN || "";
  const hasShopifyToken = !!process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const hasStripeKey = !!process.env.STRIPE_SECRET_KEY;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Impostazioni</h1>
        <p className="text-muted-foreground">Informazioni sulla configurazione del tuo account.</p>
      </div>

      <div className="grid gap-6">

        {/* SHOPIFY CONNECTION STATUS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Connessione Shopify
              {hasShopifyToken && <Badge variant="default" className="bg-green-600">Connesso</Badge>}
            </CardTitle>
            <CardDescription>
              Il tuo negozio Shopify collegato per visualizzare prodotti e ordini.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Store Domain</Label>
              <div className="flex items-center gap-2">
                <Input disabled value={shopifyDomain || "Non configurato"} className="bg-gray-50" />
                {shopifyDomain && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={`https://${shopifyDomain}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
            {hasShopifyToken && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>API Token configurato correttamente</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* STRIPE STATUS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Stripe Pagamenti
              {hasStripeKey && <Badge variant="default" className="bg-green-600">Attivo</Badge>}
            </CardTitle>
            <CardDescription>
              Sistema di pagamento per elaborare transazioni.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasStripeKey ? (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Stripe configurato (Test Mode)</span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Stripe non configurato</p>
            )}
          </CardContent>
        </Card>

        {/* TEAM MANAGEMENT */}
        <Card>
          <CardHeader>
            <CardTitle>Gestione Team</CardTitle>
            <CardDescription>Invita collaboratori per aiutarti a gestire la dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/settings/team">Gestisci Membri del Team</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
