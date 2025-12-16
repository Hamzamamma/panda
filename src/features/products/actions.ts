"use server";

import { revalidatePath } from "next/cache";
import { getShopifyAdminClient } from "@/lib/shopify";
import { ProductFormValues } from "./schema";

const GET_PRODUCTS_QUERY = `
  query GetProducts {
    products(first: 20, reverse: true) {
      edges {
        node {
          id
          title
          status
          totalInventory
          createdAt
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          priceRangeV2 {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

const CREATE_PRODUCT_MUTATION = `
  mutation CreateProduct($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        id
        title
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const DELETE_PRODUCT_MUTATION = `
  mutation productDelete($input: ProductDeleteInput!) {
    productDelete(input: $input) {
      deletedProductId
      userErrors {
        field
        message
      }
    }
  }
`;

export async function getProducts() {
  try {
    const client = await getShopifyAdminClient();
    const { data } = await client.request(GET_PRODUCTS_QUERY);
    
    const products = data.products.edges.map(({ node }: any) => ({
      id: node.id, // Keep Shopify ID (gid://shopify/Product/...)
      title: node.title,
      status: node.status, // ACTIVE, ARCHIVED, DRAFT
      inventory: node.totalInventory,
      createdAt: node.createdAt,
      images: node.images.edges.map((img: any) => img.node.url),
      price: node.priceRangeV2.minVariantPrice.amount,
      currency: node.priceRangeV2.minVariantPrice.currencyCode,
      // Default type for now, as Shopify types are custom
      type: "PHYSICAL" 
    }));

    return { products };
  } catch (error) {
    console.error("Error fetching Shopify products:", error);
    // Return empty array instead of erroring out completely to allow UI to render empty state
    return { products: [], error: "Impossibile recuperare i prodotti da Shopify. Verifica la connessione nelle impostazioni." };
  }
}

export async function createProduct(formData: ProductFormValues) {
  try {
    const client = await getShopifyAdminClient();
    
    const simpleInput = {
        title: formData.title,
        descriptionHtml: formData.description,
        status: formData.status
    };

    const { data } = await client.request(CREATE_PRODUCT_MUTATION, {
      variables: { input: simpleInput },
    });

    if (data.productCreate.userErrors.length > 0) {
      return { error: data.productCreate.userErrors[0].message };
    }

    revalidatePath("/dashboard/products");
    return { product: data.productCreate.product, success: "Prodotto creato su Shopify!" };
  } catch (error) {
    console.error("Error creating Shopify product:", error);
    return { error: "Impossibile creare il prodotto su Shopify." };
  }
}

export async function deleteProduct(id: string) {
    try {
        const client = await getShopifyAdminClient();
        
        const { data } = await client.request(DELETE_PRODUCT_MUTATION, {
            variables: { input: { id } }
        });

        if (data.productDelete.userErrors.length > 0) {
            return { error: data.productDelete.userErrors[0].message };
        }

        revalidatePath("/dashboard/products");
        return { success: "Prodotto eliminato da Shopify." };
    } catch (error) {
        console.error("Error deleting Shopify product:", error);
        return { error: "Impossibile eliminare il prodotto." };
    }
}

// Stub for update - not fully implemented yet
export async function getProductById(id: string) {
    return { product: null }; 
}
export async function updateProduct(id: string, data: any) {
    return { success: true };
}
