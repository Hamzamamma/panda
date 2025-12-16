"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-db";
import { DiscountSchema, DiscountFormValues } from "./schema";
import { z } from "zod";

export async function getDiscounts() {
  try {
    const { data: discounts } = await supabaseAdmin
        .from('DiscountCode')
        .select('*')
        .order('createdAt', { ascending: false });
    return { discounts: discounts || [], error: null as string | null };
  } catch (error) {
    console.error("Error fetching discounts:", error);
    return { discounts: [] as any[], error: "Impossibile recuperare i codici sconto." };
  }
}

export async function createDiscount(formData: DiscountFormValues) {
  try {
    const validatedData = DiscountSchema.parse(formData);
    
    const { data: discount, error } = await supabaseAdmin.from('DiscountCode').insert({
      ...validatedData,
      value: validatedData.value.toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }).select().single();

    if (error) {
        // Handle unique constraint
        if (error.code === '23505') {
            return { error: "Questo codice esiste già." };
        }
        throw error;
    }

    revalidatePath("/dashboard/marketing/discounts");
    return { discount, success: "Codice sconto creato!" };
  } catch (error) {
    console.error("Error creating discount:", error);
    if (error instanceof z.ZodError) {
      return { error: error.flatten().fieldErrors };
    }
    return { error: "Impossibile creare il codice sconto." };
  }
}

export async function toggleDiscountStatus(id: string, active: boolean) {
    try {
        const { error } = await supabaseAdmin.from('DiscountCode').update({
            active,
            updatedAt: new Date().toISOString()
        }).eq('id', id);
        
        if (error) throw error;
        
        revalidatePath("/dashboard/marketing/discounts");
        return { success: true };
    } catch (e) {
        return { error: "Errore aggiornamento." };
    }
}

export async function deleteDiscount(id: string) {
    try {
        const { error } = await supabaseAdmin.from('DiscountCode').delete().eq('id', id);
        if (error) throw error;
        
        revalidatePath("/dashboard/marketing/discounts");
        return { success: true };
    } catch (e) {
        return { error: "Errore eliminazione." };
    }
}

export async function applyDiscountCode(code: string) {
    try {
        const { data: discount, error } = await supabaseAdmin
            .from('DiscountCode')
            .select('*')
            .eq('code', code.toUpperCase())
            .single();

        if (!discount || error) {
            return { error: "Codice sconto non valido." };
        }

        if (!discount.active) {
            return { error: "Questo codice sconto non è più attivo." };
        }

        if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
            return { error: "Questo codice sconto è scaduto." };
        }

        if (discount.maxUses && discount.uses >= discount.maxUses) {
            return { error: "Questo codice sconto ha raggiunto il limite di utilizzi." };
        }

        return {
            discount: {
                id: discount.id,
                code: discount.code,
                type: discount.type,
                value: Number(discount.value)
            }
        };
    } catch (e) {
        console.error("Error applying discount:", e);
        return { error: "Errore nell'applicazione del codice sconto." };
    }
}
