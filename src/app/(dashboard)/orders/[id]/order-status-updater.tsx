"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Import Input component
import { Label } from "@/components/ui/label"; // Import Label component
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { updateOrderStatus } from "@/features/orders/actions";
import type { OrderStatus } from "@/types/database";

interface OrderStatusUpdaterProps {
    orderId: string;
    currentStatus: OrderStatus;
}

export function OrderStatusUpdater({ orderId, currentStatus }: OrderStatusUpdaterProps) {
    const [status, setStatus] = useState<OrderStatus>(currentStatus);
    const [trackingNumber, setTrackingNumber] = useState<string>('');
    const [trackingCompany, setTrackingCompany] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    async function handleUpdate() {
        setLoading(true);
        const result = await updateOrderStatus(orderId, status, trackingNumber, trackingCompany);
        setLoading(false);

        if (result.success) {
            toast({
                title: "Stato Aggiornato",
                description: result.success,
            });
            router.refresh();
        } else {
             toast({
                title: "Errore",
                description: result.error,
                variant: "destructive",
            });
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Stato Ordine</CardTitle>
                <CardDescription>Aggiorna lo stato di avanzamento</CardDescription>
            </CardHeader>
            <CardContent>
                <Select value={status} onValueChange={(val) => setStatus(val as OrderStatus)}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="PENDING">In Attesa (Pending)</SelectItem>
                        <SelectItem value="PROCESSING">In Lavorazione (Processing)</SelectItem>
                        <SelectItem value="SHIPPED">Spedito (Shipped)</SelectItem>
                        <SelectItem value="DELIVERED">Consegnato (Delivered)</SelectItem>
                        <SelectItem value="CANCELLED">Annullato (Cancelled)</SelectItem>
                    </SelectContent>
                </Select>

                {status === 'SHIPPED' && (
                    <div className="mt-4 space-y-2">
                        <div>
                            <Label htmlFor="trackingNumber">Tracking Number</Label>
                            <Input 
                                id="trackingNumber" 
                                value={trackingNumber} 
                                onChange={(e) => setTrackingNumber(e.target.value)} 
                                placeholder="Inserisci il numero di tracking" 
                            />
                        </div>
                        <div>
                            <Label htmlFor="trackingCompany">Corriere</Label>
                            <Input 
                                id="trackingCompany" 
                                value={trackingCompany} 
                                onChange={(e) => setTrackingCompany(e.target.value)} 
                                placeholder="Inserisci il nome del corriere (es. UPS, DHL)" 
                            />
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button 
                    className="w-full" 
                    onClick={handleUpdate} 
                    disabled={status === currentStatus || loading}
                >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Aggiorna Stato
                </Button>
            </CardFooter>
        </Card>
    );
}
