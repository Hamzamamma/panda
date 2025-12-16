import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ApiErrorAlertProps {
  error: string;
}

export function ApiErrorAlert({ error }: ApiErrorAlertProps) {
  // Check if it's a 401/Unauthorized or generic connection error likely due to bad credentials
  const isAuthError = error.toLowerCase().includes("unauthorized") || error.toLowerCase().includes("access token");

  return (
    <Alert variant="destructive" className="mb-6 bg-red-50 border-red-200 text-red-800">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Errore di Connessione Shopify</AlertTitle>
      <AlertDescription className="mt-2 flex flex-col gap-3">
        <p>{error}</p>
        {isAuthError && (
            <div className="flex items-center gap-2">
                <span>Le tue credenziali Shopify sembrano non essere valide.</span>
                <Button variant="outline" size="sm" className="bg-white border-red-200 text-red-800 hover:bg-red-100" asChild>
                    <Link href="/dashboard/settings">Aggiorna Credenziali</Link>
                </Button>
            </div>
        )}
      </AlertDescription>
    </Alert>
  );
}
