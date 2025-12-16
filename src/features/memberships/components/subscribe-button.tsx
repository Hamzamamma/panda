"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { subscribeToTier } from "../actions"; // Importing from feature actions

interface SubscribeButtonProps {
  tierId: string;
  price: number;
}

export function SubscribeButton({ tierId, price }: SubscribeButtonProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async () => {
    setLoading(true);
    // In a real app, this would redirect to Stripe/Shopify Checkout
    // For MVP, we simulate a successful action via server action mock
    try {
        // We pass mock user ID/Email since we might not have full context in client component without Auth Provider
        // Ideally, the Server Action extracts user from session.
        const result = await subscribeToTier(tierId, "current_user_id", "user@example.com");
        
        if (result.success) {
            toast({
                title: "Iscrizione Avviata! 🎉",
                description: `Ti stai iscrivendo al piano da €${price.toFixed(2)}.`,
            });
        } else {
            toast({
                title: "Errore",
                description: "Impossibile completare l'iscrizione.",
                variant: "destructive"
            });
        }
    } catch (e) {
        toast({ title: "Errore", description: "Qualcosa è andato storto.", variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };

  return (
    <Button className="w-full" onClick={handleSubscribe} disabled={loading}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Abbonati
    </Button>
  );
}
