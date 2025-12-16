"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Sale {
  id: string;
  name: string;
  email: string;
  amount: number;
  avatarFallback?: string;
}

interface RecentSalesProps {
  sales?: Sale[];
}

export function RecentSales({ sales = [] }: RecentSalesProps) {
  if (sales.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-muted-foreground">
        Nessuna vendita recente
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sales.map((sale) => (
        <div key={sale.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {sale.avatarFallback || sale.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{sale.name}</p>
            <p className="text-sm text-muted-foreground">{sale.email}</p>
          </div>
          <div className="ml-auto font-medium">+€{sale.amount.toFixed(2)}</div>
        </div>
      ))}
    </div>
  );
}
