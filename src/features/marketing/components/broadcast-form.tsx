"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { sendBroadcast } from "../broadcast-actions";
import { z } from "zod";

const formSchema = z.object({
  subject: z.string().min(5, "L'oggetto deve essere di almeno 5 caratteri"),
  content: z.string().min(10, "Il messaggio è troppo corto"),
  targetAudience: z.enum(["ALL_USERS", "MEMBERS_ONLY", "BUYERS_ONLY"]),
});

export function BroadcastForm() {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      content: "",
      targetAudience: "ALL_USERS",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const result = await sendBroadcast(data);

    if (result.success) {
      toast({ title: "Inviato!", description: result.success });
      form.reset();
    } else {
      toast({ title: "Errore", description: result.error, variant: "destructive" });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg border shadow-sm">
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Oggetto Email</FormLabel>
              <FormControl>
                <Input placeholder="Es. Novità esclusive per te!" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="targetAudience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destinatari</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona audience" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ALL_USERS">Tutti gli utenti (Newsletter)</SelectItem>
                  <SelectItem value="MEMBERS_ONLY">Solo Abbonati (VIP)</SelectItem>
                  <SelectItem value="BUYERS_ONLY">Clienti Shop (Chi ha comprato)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Scegli chi riceverà questo messaggio.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Messaggio</FormLabel>
              <FormControl>
                <Textarea 
                    placeholder="Scrivi qui il tuo messaggio..." 
                    className="min-h-[200px]" 
                    {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full md:w-auto" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Invio in corso...
            </>
          ) : (
            <>
                <Send className="mr-2 h-4 w-4" />
                Invia Broadcast
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
