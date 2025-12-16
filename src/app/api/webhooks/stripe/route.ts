import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-db";
import { sendEmail, EmailTemplates } from "@/lib/email/service";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    console.log("💰 Payment successful!", session.id);

    // 1. Extract Order Data from Session & Metadata
    const customerEmail = session.customer_details?.email || session.customer_email;
    const customerName = session.customer_details?.name || "Guest";
    const totalAmount = session.amount_total ? session.amount_total / 100 : 0;
    
    // Metadata contains simplified items
    const metadataItems = session.metadata?.itemsSnapshot 
        ? JSON.parse(session.metadata.itemsSnapshot) 
        : [];

    // 2. Create Order in DB
    try {
        const { data: order, error: orderError } = await supabaseAdmin.from('Order').insert({
            customerName,
            customerEmail,
            total: totalAmount,
            status: "PROCESSING",
            orderNumber: `ORD-${Date.now()}`, // Simple generation
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }).select().single();

        if (orderError) throw orderError;

        // Create Order Items
        const orderItems = metadataItems.map((item: any) => ({
            orderId: order.id,
            productId: item.id,
            quantity: item.qty,
            price: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }));

        const { error: itemsError } = await supabaseAdmin.from('OrderItem').insert(orderItems);
        if (itemsError) throw itemsError;

        // Fetch products to include in email
        const productIds = metadataItems.map((i: any) => i.id);
        const { data: products } = await supabaseAdmin.from('Product').select('*').in('id', productIds);
        
        const emailItems = metadataItems.map((item: any) => {
            const product = products?.find(p => p.id === item.id);
            return {
                title: product?.title || 'Prodotto',
                quantity: item.qty,
                price: 0
            };
        });

        // 3. Send Email
        await sendEmail({
            to: customerEmail,
            subject: "Conferma Ordine - Pagamento Ricevuto",
            html: EmailTemplates.orderConfirmation(order.orderNumber, totalAmount, emailItems)
        });

    } catch (e) {
        console.error("Error creating order from webhook:", e);
        return NextResponse.json({ error: "DB Error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
