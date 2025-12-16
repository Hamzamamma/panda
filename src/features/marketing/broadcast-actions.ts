"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-db";
import { sendEmail, EmailTemplates } from "@/lib/email/service";
import { z } from "zod";

const BroadcastSchema = z.object({
  subject: z.string().min(1, "Oggetto richiesto"),
  content: z.string().min(1, "Contenuto richiesto"),
  targetAudience: z.enum(["ALL_USERS", "MEMBERS_ONLY", "BUYERS_ONLY"]),
});

export type BroadcastFormValues = z.infer<typeof BroadcastSchema>;

export async function sendBroadcast(formData: BroadcastFormValues) {
  try {
    const data = BroadcastSchema.parse(formData);

    // 1. Create Broadcast Record
    await supabaseAdmin.from('Broadcast').insert({
      subject: data.subject,
      content: data.content,
      targetAudience: data.targetAudience,
      createdAt: new Date().toISOString(),
      sentAt: new Date().toISOString()
    });

    // 2. Fetch Target Emails (Mock Logic)
    let recipients: string[] = [];
    
    if (data.targetAudience === 'ALL_USERS') {
        // Fetch all unique emails from Orders
        const { data: buyers } = await supabaseAdmin.from('Order').select('customerEmail');
        if (buyers) {
            recipients = Array.from(new Set(buyers.map(b => b.customerEmail)));
        }
        // + Members logic...
    } else if (data.targetAudience === 'BUYERS_ONLY') {
        const { data: buyers } = await supabaseAdmin.from('Order').select('customerEmail');
        if (buyers) {
            recipients = Array.from(new Set(buyers.map(b => b.customerEmail)));
        }
    } else {
        // Members only
        recipients = ["member1@example.com", "member2@example.com"]; // Mock
    }

    // 3. Send Emails (Batching would be needed for real prod)
    // For demo, we just send one log
    await sendEmail({
        to: `${recipients.length} recipients (e.g. ${recipients[0] || 'nobody'})`,
        subject: data.subject,
        html: EmailTemplates.broadcast(data.content)
    });

    revalidatePath("/dashboard/marketing/newsletter");
    return { success: `Broadcast inviato a ${recipients.length} utenti!` };

  } catch (error) {
    console.error(error);
    return { error: "Errore invio broadcast." };
  }
}

export async function getBroadcasts() {
    try {
        const { data: broadcasts } = await supabaseAdmin
            .from('Broadcast')
            .select('*')
            .order('sentAt', { ascending: false });
            
        return { broadcasts: broadcasts || [] };
    } catch (e) {
        return { broadcasts: [] };
    }
}
