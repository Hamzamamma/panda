import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SubscribeButton } from "./subscribe-button"; // Assuming this will be created next

interface TierCardProps {
  id: string;
  name: string;
  price: number;
  currency: string;
  description?: string | null;
  benefits?: string[];
  recommended?: boolean;
}

export function TierCard({ id, name, price, currency, description, benefits, recommended }: TierCardProps) {
  return (
    <Card className={`flex flex-col relative ${recommended ? 'border-primary shadow-md' : ''}`}>
      {recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge variant="default">Consigliato</Badge>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="mb-4">
            <span className="text-3xl font-bold">{currency === 'EUR' ? '€' : '$'}{price.toFixed(2)}</span>
            <span className="text-muted-foreground">/mese</span>
        </div>
        <Separator className="mb-4" />
        <ul className="space-y-2 text-sm">
            {benefits && benefits.length > 0 ? (
                benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>{benefit}</span>
                    </li>
                ))
            ) : (
                <li className="text-muted-foreground italic">Nessun benefit specifico</li>
            )}
        </ul>
      </CardContent>
      <CardFooter>
        <SubscribeButton tierId={id} price={price} />
      </CardFooter>
    </Card>
  );
}
