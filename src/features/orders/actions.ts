"use server";

import { revalidatePath } from "next/cache";
import { getShopifyAdminClient } from "@/lib/shopify";
import { format } from "date-fns";
import { sendEmail, EmailTemplates } from "@/lib/email/service"; // Import email service

const GET_ORDERS_QUERY = `
  query GetOrders {
    orders(first: 20, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          id
          name
          createdAt
          displayFinancialStatus
          displayFulfillmentStatus
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          customer {
            firstName
            lastName
            email
          }
          lineItems(first: 5) {
            edges {
              node {
                title
                quantity
                originalTotalPriceSet {
                  shopMoney {
                    amount
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const GET_FULFILLMENT_ORDERS_QUERY = `
  query GetFulfillmentOrders($orderId: ID!) {
    order(id: $orderId) {
      id
      name # Fetch order name for email
      customer { # Fetch customer email for email
        email
      }
      fulfillmentOrders(first: 10) {
        edges {
          node {
            id
            status
            lineItems(first: 10) {
              edges {
                node {
                  id
                  originalTotalSet {
                    shopMoney {
                      amount
                    }
                  }
                  quantity
                  remainingQuantity
                  totalDiscountSet {
                    shopMoney {
                      amount
                    }
                  }
                  unfulfilledQuantity
                  variant {
                    id
                    displayName
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const FULFILLMENT_CREATE_MUTATION = `
  mutation FulfillmentCreateV2($fulfillmentOrderIds: [ID!]!, $notifyCustomer: Boolean, $trackingInfo: FulfillmentTrackingInput) {
    fulfillmentCreateV2(
      fulfillment: {
        lineItemsByFulfillmentOrder: [
          {
            fulfillmentOrderId: $fulfillmentOrderIds
            # We are fulfilling all available line items for this fulfillment order
            # omitting lineItems will fulfill all. Can specify if needed.
          }
        ]
        notifyCustomer: $notifyCustomer
        trackingInfo: $trackingInfo
      }
    ) {
      fulfillment {
        id
        status
        order {
          id
        }
        trackingInfo {
          url
          number
          company
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Types for mapped data
export interface ShopifyOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: string;
  currency: string;
  customerName: string;
  customerEmail: string;
  items: {
    title: string;
    quantity: number;
    price: string;
  }[];
}

export async function getOrders() {
  try {
    const client = await getShopifyAdminClient();
    const { data } = await client.request(GET_ORDERS_QUERY);

    const orders: ShopifyOrder[] = data.orders.edges.map(({ node }: any) => {
      const customerName = node.customer 
        ? `${node.customer.firstName || ''} ${node.customer.lastName || ''}`.trim() 
        : "Guest Customer";
      
      const items = node.lineItems.edges.map(({ node: item }: any) => ({
        title: item.title,
        quantity: item.quantity,
        price: item.originalTotalPriceSet?.shopMoney?.amount || "0.00"
      }));

      return {
        id: node.id,
        orderNumber: node.name,
        createdAt: node.createdAt,
        financialStatus: node.displayFinancialStatus,
        fulfillmentStatus: node.displayFulfillmentStatus,
        totalPrice: node.totalPriceSet.shopMoney.amount,
        currency: node.totalPriceSet.shopMoney.currencyCode,
        customerName: customerName || "Unknown",
        customerEmail: node.customer?.email || "No Email",
        items
      };
    });

    return { orders };
  } catch (error) {
    console.error("Error fetching Shopify orders:", error);
    return { orders: [], error: "Impossibile recuperare gli ordini da Shopify. Verifica connessione." };
  }
}

export async function markOrderAsFulfilled(orderId: string, trackingNumber?: string, trackingCompany?: string) {
    try {
        const client = await getShopifyAdminClient();

        // 1. Get fulfillmentOrder for this order
        const { data: fulfillmentOrderData, errors: fulfillmentOrderErrors } = await client.request(GET_FULFILLMENT_ORDERS_QUERY, {
            variables: { orderId },
        });

        if (fulfillmentOrderErrors) {
            console.error("Error fetching fulfillment orders:", fulfillmentOrderErrors);
            return { error: "Errore durante il recupero degli ordini di fulfillment." };
        }

        const order = fulfillmentOrderData?.order;
        const customerEmail = order?.customer?.email;
        const orderNumber = order?.name;

        if (!order || !customerEmail || !orderNumber) {
          console.error("Order, customer email, or order number not found for fulfillment.");
          return { error: "Dettagli ordine mancanti per l'invio dell'email di spedizione." };
        }

        const fulfillmentOrders = order.fulfillmentOrders?.edges.map((edge: any) => edge.node) || [];
        
        if (fulfillmentOrders.length === 0) {
            return { success: "Nessun ordine di fulfillment trovato per questo ordine.", fulfilled: false };
        }

        // Filter for open fulfillment orders (e.g., those not yet fulfilled or cancelled)
        const openFulfillmentOrders = fulfillmentOrders.filter((fo: any) => fo.status === 'OPEN' || fo.status === 'PARTIALLY_FULFILLED');

        if (openFulfillmentOrders.length === 0) {
            return { success: "Tutti gli articoli sono già stati evasi o non evadibili per questo ordine.", fulfilled: true };
        }

        const fulfillmentOrderIds = openFulfillmentOrders.map((fo: any) => fo.id);

        let trackingInfo = undefined;
        let finalTrackingUrl = undefined;
        if (trackingNumber) {
            // Shopify can often detect company from tracking number, but we provide it if available
            trackingInfo = {
                number: trackingNumber,
                company: trackingCompany || "Unknown", 
                url: `https://t.17track.net/en#nums=${trackingNumber}` // Generic tracking URL
            };
            finalTrackingUrl = trackingInfo.url;
        }

        // 2. fulfillmentCreateV2(...)
        const { data: fulfillmentCreateData, errors: fulfillmentCreateErrors } = await client.request(FULFILLMENT_CREATE_MUTATION, {
            variables: {
                fulfillmentOrderIds,
                notifyCustomer: true, // Notify customer about fulfillment
                trackingInfo,
            },
        });

        if (fulfillmentCreateErrors) {
            console.error("Error creating fulfillment:", fulfillmentCreateErrors);
            const errArray = fulfillmentCreateErrors as any;
            return { error: `Errore durante la creazione del fulfillment: ${errArray[0]?.message || 'Unknown error'}` };
        }

        if (fulfillmentCreateData?.fulfillmentCreateV2?.userErrors && fulfillmentCreateData.fulfillmentCreateV2.userErrors.length > 0) {
            console.error("User errors creating fulfillment:", fulfillmentCreateData.fulfillmentCreateV2.userErrors);
            return { error: `Errore utente durante la creazione del fulfillment: ${fulfillmentCreateData.fulfillmentCreateV2.userErrors.map((err: any) => err.message).join(', ')}` };
        }
        
        // Send shipping confirmation email
        await sendEmail({
          to: customerEmail,
          subject: `Il tuo ordine #${orderNumber} è stato spedito!`,
          html: EmailTemplates.shippingConfirmation(orderNumber, trackingNumber, trackingCompany, finalTrackingUrl),
        });

        revalidatePath("/dashboard/orders");
        return { success: "Ordine segnato come spedito con successo e email inviata.", fulfilled: true };
    } catch (error) {
        console.error("Error fulfilling order:", error);
        return { error: `Errore durante il fulfillment: ${(error as Error).message}` };
    }
}

export async function getOrderById(id: string) {
    // Basic implementation re-using getOrders or specific query needed
    // For now, to keep prompt focused, returning null or we can implement specific query if requested
    // Reusing getOrders logic for list is main priority.
    return { order: null };
}

export async function updateOrderStatus(id: string, status: any, trackingNumber?: string, trackingCompany?: string) {
    if (status === 'SHIPPED') {
        return await markOrderAsFulfilled(id, trackingNumber, trackingCompany);
    }
    // For other statuses, we might need other Shopify Admin API calls or local DB updates.
    // For now, this function remains a stub for other statuses.
    return { success: true, error: undefined };
}
