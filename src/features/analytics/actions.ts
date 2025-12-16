"use server";

import { getShopifyAdminClient } from "@/lib/shopify";
import { format, subDays, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from "date-fns";
import { it } from "date-fns/locale";

// GraphQL query to fetch orders for analytics
const GET_ORDERS_ANALYTICS_QUERY = `
  query GetOrdersAnalytics($query: String, $first: Int = 250) { # Added $first variable with default
    orders(first: $first, query: $query, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          id
          name
          createdAt
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          displayFinancialStatus
          displayFulfillmentStatus
          customer {
            id
            email
            firstName
            lastName
          }
          lineItems(first: 20) { # Fetch line items for CSV
            edges {
              node {
                title
                quantity
              }
            }
          }
        }
      }
    }
  }
`;

// Helper to format currency
const formatCurrency = (amount: number, currency = "EUR") => {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency }).format(amount);
};

export async function getDashboardStats() {
  try {
    const client = await getShopifyAdminClient();
    
    // Query orders from the last 30 days
    const date30DaysAgo = subDays(new Date(), 30).toISOString();
    const query = `created_at:>=${date30DaysAgo}`;
    const { data } = await client.request(GET_ORDERS_ANALYTICS_QUERY, { query } as any);
    const orders = data.orders.edges.map((edge: any) => edge.node);

    // 1. Total Revenue (Last 30 days)
    // Filter only paid orders to be accurate
    const paidOrders = orders.filter((o: any) => o.displayFinancialStatus === 'PAID' || o.displayFinancialStatus === 'PARTIALLY_PAID');
    const totalRevenue = paidOrders.reduce((acc: number, order: any) => acc + Number(order.totalPriceSet.shopMoney.amount), 0);

    // 2. Total Orders (Last 30 days)
    const orderCount = orders.length;

    // 3. Products Count (Approximation)
    const productCount = 0; // Requires different API call or iterating

    // 4. Active Members / Customers
    // Unique customers in the last 30 days
    const uniqueCustomers = new Set(orders.map((o: any) => o.customer?.email).filter(Boolean));
    const memberCount = uniqueCustomers.size;

    return {
      totalRevenue,
      orderCount,
      productCount, // Placeholder
      memberCount,
    };
  } catch (error) {
    console.error("Analytics Stats Error:", error);
    return {
      totalRevenue: 0,
      orderCount: 0,
      productCount: 0,
      memberCount: 0,
    };
  }
}

export async function getGraphRevenue() {
  try {
    const client = await getShopifyAdminClient();

    // Fetch orders for the last 12 months
    const date12MonthsAgo = subMonths(new Date(), 12).toISOString();
    const query = `created_at:>=${date12MonthsAgo}`;
    
    const { data } = await client.request(GET_ORDERS_ANALYTICS_QUERY, { query } as any);
    const orders = data.orders.edges.map((edge: any) => edge.node);

    // Group by Month
    const monthlyData: Record<string, number> = {};
    
    // Initialize all months to 0
    const monthsInterval = eachMonthOfInterval({
        start: subMonths(new Date(), 11),
        end: new Date()
    });

    monthsInterval.forEach(date => {
        const key = format(date, 'yyyy-MM');
        monthlyData[key] = 0;
    });

    // Sum revenue
    orders.forEach((order: any) => {
        if (order.displayFinancialStatus === 'PAID' || order.displayFinancialStatus === 'PARTIALLY_PAID') {
            const date = new Date(order.createdAt);
            const key = format(date, 'yyyy-MM');
            if (monthlyData[key] !== undefined) {
                monthlyData[key] += Number(order.totalPriceSet.shopMoney.amount);
            }
        }
    });

    // Format for Recharts
    const graphData = Object.entries(monthlyData).map(([key, total]) => {
        const [year, month] = key.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return {
            name: format(date, 'MMM', { locale: it }), // "Gen", "Feb"...
            fullDate: key,
            total: total
        };
    }).sort((a, b) => a.fullDate.localeCompare(b.fullDate));

    return graphData;

  } catch (error) {
    console.error("Graph Revenue Error:", error);
    return [];
  }
}

export async function generateCsvExport() {
    try {
        const client = await getShopifyAdminClient();
        // Fetch a large number of orders for export. Shopify API has a limit of 250 for `first` param.
        // For larger stores, pagination would be needed.
        const { data } = await client.request(GET_ORDERS_ANALYTICS_QUERY, {
            variables: { first: 250 }, // Fetch up to 250 orders. Adjust or paginate for more.
        });
        const orders = data.orders.edges.map((edge: any) => edge.node);

        if (!orders || orders.length === 0) {
            return { success: false, error: "Nessun ordine trovato per l'esportazione CSV." };
        }

        const headers = [
            "Order ID", "Order Number", "Created At", "Financial Status", "Fulfillment Status",
            "Total Price", "Currency", "Customer Name", "Customer Email", "Item Titles", "Item Quantities"
        ];

        const rows = orders.map((order: any) => {
            const customerName = order.customer 
                ? `${order.customer.firstName || ''} ${order.customer.lastName || ''}`.trim() 
                : "Guest";
            const customerEmail = order.customer?.email || "N/A";

            const itemTitles = order.lineItems.edges.map((edge: any) => edge.node.title).join('; ');
            const itemQuantities = order.lineItems.edges.map((edge: any) => edge.node.quantity).join('; ');

            return [
                `"${order.id}"`, // Enclose in quotes to handle commas
                `"${order.name}"`,
                `"${format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm:ss')}"`,
                `"${order.displayFinancialStatus}"`,
                `"${order.displayFulfillmentStatus}"`,
                `"${order.totalPriceSet.shopMoney.amount}"`,
                `"${order.totalPriceSet.shopMoney.currencyCode}"`,
                `"${customerName}"`,
                `"${customerEmail}"`,
                `"${itemTitles}"`,
                `"${itemQuantities}"`,
            ].join(',');
        });

        const csvContent = [headers.join(','), ...rows].join('\n');
        const filename = `orders_export_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`;

        return { success: true, csvContent, filename };
    } catch (error) {
        console.error("Error generating CSV export:", error);
        return { success: false, error: `Errore durante la generazione dell'esportazione CSV: ${(error as Error).message}` };
    }
}

// Re-export recent sales adapted for Shopify
export async function getRecentSales() {
    try {
        const client = await getShopifyAdminClient();
        const { data } = await client.request(GET_ORDERS_ANALYTICS_QUERY); // Uses default first: 250 from top query
        const orders = data.orders.edges.slice(0, 5).map((edge: any) => edge.node); // Take first 5

        return orders.map((order: any) => ({
            id: order.id,
            name: order.customer ? `${order.customer.firstName || ''} ${order.customer.lastName || ''}`.trim() : "Guest",
            email: order.customer?.email || "N/A",
            amount: Number(order.totalPriceSet.shopMoney.amount),
            avatarFallback: (order.customer?.firstName?.[0] || "G") + (order.customer?.lastName?.[0] || "U")
        }));
    } catch (e) {
        return [];
    }
}