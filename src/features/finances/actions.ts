"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-db";
import { getShopifyAdminClient } from "@/lib/shopify";

// Configure your platform fee here
const PLATFORM_FEE_PERCENTAGE = 0.05; // 5%

// Helper to fetch total sales from Shopify (Paid orders)
async function getShopifyTotalSales() {
    const query = `
      query GetTotalSales {
        orders(first: 250, query: "financial_status:PAID", sortKey: CREATED_AT, reverse: true) {
          edges {
            node {
              totalPriceSet {
                shopMoney {
                  amount
                }
              }
            }
          }
        }
      }
    `;
    
    try {
        const client = await getShopifyAdminClient();
        const { data } = await client.request(query);
        const totalSales = data.orders.edges.reduce((acc: number, edge: any) => {
            return acc + Number(edge.node.totalPriceSet.shopMoney.amount);
        }, 0);
        return totalSales;
    } catch (e) {
        console.error("Shopify Sales Fetch Error", e);
        return 0;
    }
}

export async function getFinancialData() {
  try {
    const { data: storeConfig } = await supabaseAdmin.from('StoreConfig').select('*').limit(1).single();
    if (!storeConfig) {
        // ... (create default logic same as before if needed)
        return { balance: { availableAmount: 0, pendingAmount: 0 }, payouts: [], totalPaid: 0 };
    }

    // 1. Calculate Total Earnings from Shopify
    const totalSales = await getShopifyTotalSales();
    const totalEarnings = totalSales * (1 - PLATFORM_FEE_PERCENTAGE);

    // 2. Calculate Total Paid Out (from local DB)
    const { data: paidPayouts } = await supabaseAdmin
        .from('Payout')
        .select('amount')
        .in('status', ['PAID', 'REQUESTED']);
        
    const totalPaidOut = paidPayouts 
        ? paidPayouts.reduce((acc, curr) => acc + Number(curr.amount), 0)
        : 0;

    // 3. Determine Available Balance
    const availableAmount = Math.max(0, totalEarnings - totalPaidOut);
    
    const pendingAmount = 0; 

    // Update local Balance record for consistency
    const { data: balance } = await supabaseAdmin.from('Balance').select('*').eq('id', storeConfig.id).single();
    
    if (balance) {
        await supabaseAdmin.from('Balance').update({
            availableAmount: availableAmount,
            pendingAmount: pendingAmount,
            updatedAt: new Date().toISOString()
        }).eq('id', balance.id);
    } else {
        await supabaseAdmin.from('Balance').insert({
            id: storeConfig.id,
            availableAmount,
            pendingAmount,
            updatedAt: new Date().toISOString()
        });
    }

    const { data: payouts } = await supabaseAdmin
        .from('Payout')
        .select('*')
        .order('createdAt', { ascending: false })
        .limit(20);

    return {
        balance: { 
            id: balance?.id || "calc", 
            availableAmount, 
            pendingAmount 
        },
        payouts: payouts || [],
        totalPaid: totalPaidOut
    };

  } catch (error) {
    console.warn("Finance Calculation Error:", error);
    return {
        balance: { id: "mock", availableAmount: 0, pendingAmount: 0 },
        payouts: [],
        totalPaid: 0
    };
  }
}

export async function requestPayout(amount: number, method: any) {
    try {
        // Re-calculate balance to ensure validity
        const { balance } = await getFinancialData();
        
        if (Number(balance.availableAmount) < amount) {
            return { error: `Saldo insufficiente. Disponibile: €${Number(balance.availableAmount).toFixed(2)}` };
        }

        await supabaseAdmin.from('Payout').insert({
            amount: amount,
            method: method,
            status: 'REQUESTED',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        revalidatePath("/dashboard/finances");
        return { success: "Richiesta inviata con successo!" };
    } catch (e) {
        console.error("Error requesting payout:", e);
        return { error: "Errore durante la richiesta." };
    }
}

export async function updateFinanceSettings(currency: string, taxRate: number, collectTaxes: boolean, shippingAddress: string | null) {
    try {
        const { data: storeConfig } = await supabaseAdmin.from('StoreConfig').select('*').limit(1).single();
        if (storeConfig) {
            await supabaseAdmin.from('StoreConfig').update({
                currency, 
                taxRate, 
                collectTaxes, 
                shippingAddress,
                updatedAt: new Date().toISOString()
            }).eq('id', storeConfig.id);
            
            revalidatePath("/dashboard/finances");
            return { success: "Impostazioni aggiornate!" };
        }
        return { error: "Store Config not found" };
    } catch (e) {
        return { error: "Update failed" };
    }
}
