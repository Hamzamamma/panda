import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // HMAC Verification logic should go here to ensure request is from Shopify
    // const hmac = req.headers.get('X-Shopify-Hmac-Sha256');
    // const topic = req.headers.get('X-Shopify-Topic');
    
    // Parse body
    const textBody = await req.text(); // Shopify webhooks need raw body for HMAC
    const payload = JSON.parse(textBody);

    console.log("🛍️ Shopify Webhook Received");

    // Handle different topics
    // if (topic === 'orders/create') { ... }

    return NextResponse.json({ message: "Webhook processed" }, { status: 200 });
  } catch (error) {
    console.error("Shopify Webhook Error:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
