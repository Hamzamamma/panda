"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { MembershipTierSchema, MembershipTierFormValues } from "../schema";
import { createMembershipTier, updateMembershipTier } from "../actions";
import type { MembershipTier } from "@/types/database";

interface MembershipFormProps {
  initialData?: MembershipTier;
}

export function MembershipForm({ initialData }: MembershipFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<MembershipTierFormValues>({
    resolver: zodResolver(MembershipTierSchema) as any,
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: Number(initialData?.price) || 0,
      currency: initialData?.currency || "EUR",
      benefits: initialData?.benefits || [],
      status: initialData?.status || "DRAFT",
    },
  });

  async function onSubmit(data: MembershipTierFormValues) {
    let result;
    if (initialData?.id) {
      result = await updateMembershipTier(initialData.id, data);
    } else {
      result = await createMembershipTier(data);
    }

    if (result?.success) {
      toast({
        title: "Successo!",
        description: result.success,
      });
      router.push("/dashboard/memberships");
      form.reset();
    } else if (result?.error) {
       if (typeof result.error === 'object' && !Array.isArray(result.error)) {
            Object.keys(result.error).forEach(key => {
                form.setError(key as keyof MembershipTierFormValues, {
                    type: "server",
                    message: (result.error as any)[key][0]
                });
            });
        } else {
            toast({
                title: "Errore",
                description: typeof result.error === 'string' ? result.error : "Si è verificato un errore inatteso.",
                variant: "destructive",
            });
        }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
          
          <div className="md:col-span-2 space-y-6">
            <div className="border p-6 rounded-lg bg-white shadow-sm space-y-4">
                <h2 className="text-lg font-semibold">Informazioni Livello</h2>
                
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nome Livello</FormLabel>
                        <FormControl>
                        <Input placeholder="Es. Fan, VIP, Elite" {...field} />
                        </FormControl>
                        <FormDescription>Il nome pubblico del tuo livello di abbonamento.</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Descrizione</FormLabel>
                        <FormControl>
                        <Textarea
                            placeholder="Una descrizione dettagliata dei vantaggi..."
                            rows={4}
                            {...field}
                            value={field.value || ""}
                        />
                        </FormControl>
                        <FormDescription>Descrivi cosa ottengono i tuoi abbonati.</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="benefits"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Vantaggi (uno per riga)</FormLabel>
                        <FormControl>
                        <Textarea
                            placeholder="Accesso esclusivo\nContenuti bonus\nSconto merce"
                            rows={5}
                            value={field.value?.join('\n') || ''}
                            onChange={(e) => field.onChange(e.target.value.split('\n').map(s => s.trim()).filter(s => s))}
                        />
                        </FormControl>
                        <FormDescription>Inserisci un vantaggio per riga.</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
          </div>

          <div className="md:col-span-1 space-y-6">
            <div className="border p-6 rounded-lg bg-white shadow-sm space-y-4">
                <h2 className="text-lg font-semibold">Configurazione</h2>
                
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Stato</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Seleziona stato" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="DRAFT">Bozza</SelectItem>
                            <SelectItem value="ACTIVE">Attivo</SelectItem>
                            <SelectItem value="ARCHIVED">Archiviato</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Prezzo Mensile (€)</FormLabel>
                        <FormControl>
                        <Input type="number" step="0.01" {...field} value={field.value === 0 ? "" : field.value} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Valuta</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Seleziona la valuta" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full md:w-auto" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvataggio...
            </>
          ) : (
            initialData ? "Aggiorna Livello" : "Crea Livello"
          )}
        </Button>
      </form>
    </Form>
  );
}
