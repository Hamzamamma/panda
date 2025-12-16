"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { toggleDiscountStatus } from "../actions";
import { useToast } from "@/components/ui/use-toast";

export function DiscountToggle({ id, active }: { id: string; active: boolean }) {
  const [isActive, setIsActive] = useState(active);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleToggle(checked: boolean) {
    setLoading(true);
    // Optimistic update
    setIsActive(checked); 
    
    const result = await toggleDiscountStatus(id, checked);
    setLoading(false);

    if (result.error) {
      setIsActive(!checked); // Revert
      toast({ title: "Errore", description: "Impossibile aggiornare lo stato.", variant: "destructive" });
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Switch checked={isActive} onCheckedChange={handleToggle} disabled={loading} />
      <span className="text-sm text-muted-foreground">{isActive ? "Attivo" : "Inattivo"}</span>
    </div>
  );
}
