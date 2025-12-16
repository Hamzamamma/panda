import { getBroadcasts } from "@/features/marketing/broadcast-actions";
import { BroadcastForm } from "@/features/marketing/components/broadcast-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Mail } from "lucide-react";

export default async function NewsletterPage() {
  const { broadcasts } = await getBroadcasts();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Newsletter & Broadcast</h1>
        <p className="text-muted-foreground">Invia aggiornamenti via email ai tuoi fan e clienti.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* LEFT: COMPOSER */}
        <div className="lg:col-span-2">
            <BroadcastForm />
        </div>

        {/* RIGHT: HISTORY */}
        <div>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Cronologia Invii
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {broadcasts && broadcasts.length > 0 ? (
                        <div className="space-y-6">
                            {broadcasts.map((b) => (
                                <div key={b.id} className="border-b pb-4 last:border-0 last:pb-0">
                                    <h4 className="font-semibold line-clamp-1">{b.subject}</h4>
                                    <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                                        <span>{format(new Date(b.sentAt), "dd/MM/yyyy HH:mm")}</span>
                                        <Badge variant="outline" className="text-[10px]">
                                            {b.targetAudience.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            Nessun messaggio inviato.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}