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

import { ProductSchema, ProductFormValues } from "../schema";
import { createProduct } from "../actions";

export function ProductForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      compareAtPrice: 0,
      status: "DRAFT",
      type: "PHYSICAL",
      inventory: 0,
      images: [],
    },
  });

  async function onSubmit(data: ProductFormValues) {
    const result = await createProduct(data);

    if (result.success) {
      toast({
        title: "Successo!",
        description: result.success,
      });
      router.push("/dashboard/products");
      form.reset();
    } else if (result.error) {
        if (typeof result.error === 'object' && !Array.isArray(result.error)) {
            // Server-side validation errors
            Object.keys(result.error).forEach(key => {
                form.setError(key as keyof ProductFormValues, {
                    type: "server",
                    message: (result.error as any)[key][0]
                });
            });
        } else {
             // Generic error
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
          
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="border p-6 rounded-lg bg-white shadow-sm space-y-4">
                <h2 className="text-lg font-semibold">Informazioni Generali</h2>
                
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Titolo</FormLabel>
                        <FormControl>
                        <Input placeholder="Es. T-Shirt PANDA Limited Edition" {...field} />
                        </FormControl>
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
                            placeholder="Descrivi il prodotto..."
                            rows={4}
                            {...field}
                            value={field.value || ""}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>

            <div className="border p-6 rounded-lg bg-white shadow-sm space-y-4">
                <h2 className="text-lg font-semibold">Media</h2>
                <div className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg bg-gray-50 text-gray-400">
                    <p>Funzionalità Upload Immagini (Placeholder)</p>
                </div>
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="md:col-span-1 space-y-6">
            <div className="border p-6 rounded-lg bg-white shadow-sm space-y-4">
                <h2 className="text-lg font-semibold">Stato & Organizzazione</h2>
                
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
                    name="type"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tipo Prodotto</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Seleziona tipo" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="PHYSICAL">Fisico</SelectItem>
                            <SelectItem value="DIGITAL">Digitale</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>

            <div className="border p-6 rounded-lg bg-white shadow-sm space-y-4">
                <h2 className="text-lg font-semibold">Prezzo & Inventario</h2>
                
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Prezzo (€)</FormLabel>
                        <FormControl>
                        <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="compareAtPrice"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Prezzo Scontato (Opzionale)</FormLabel>
                        <FormControl>
                        <Input type="number" step="0.01" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormDescription>Se inserito, il prezzo originale verrà barrato.</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="inventory"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Quantità</FormLabel>
                        <FormControl>
                        <Input type="number" {...field} />
                        </FormControl>
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
            "Crea Prodotto"
          )}
        </Button>
      </form>
    </Form>
  );
}
