import { createStorefrontApiClient } from "@shopify/storefront-api-client";
import { createAdminApiClient } from "@shopify/admin-api-client";

const API_VERSION = "2025-01";

// Factory function to create a dynamic Storefront client
export function createShopifyClient(domain: string, accessToken: string) {
  return createStorefrontApiClient({
    storeDomain: domain,
    apiVersion: API_VERSION,
    publicAccessToken: accessToken,
  });
}

// Factory for Admin API (needed for Inventory, Fulfillment, Orders, Products)
export function createShopifyAdminClient(domain: string, adminAccessToken: string) {
  return createAdminApiClient({
    storeDomain: domain,
    apiVersion: API_VERSION,
    accessToken: adminAccessToken,
  });
}

// Default Admin client from env variables
export function getShopifyAdminClient() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  if (!domain || !token) {
    throw new Error("Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_ACCESS_TOKEN");
  }

  return createShopifyAdminClient(domain, token);
}

// Lazy Storefront client - only create if tokens exist
let _storefrontClient: ReturnType<typeof createStorefrontApiClient> | null = null;

export function getShopifyStorefrontClient() {
  if (_storefrontClient) return _storefrontClient;

  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !token) {
    return null; // Return null instead of throwing - Storefront API is optional
  }

  _storefrontClient = createStorefrontApiClient({
    storeDomain: domain,
    apiVersion: API_VERSION,
    publicAccessToken: token,
  });

  return _storefrontClient;
}

// Deprecated: For backward compatibility only
export const shopifyClient = null as any;
