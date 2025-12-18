import { useQuery } from "@tanstack/react-query";
import { medusaClient } from "@/lib/medusa-client";

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      // Per ora usiamo lo store client, se serve admin dovremo aggiungere api key
      const { orders } = await medusaClient.orders.list();
      return orders;
    },
  });
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { products } = await medusaClient.products.list();
      return products;
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      const { product } = await medusaClient.products.retrieve(id);
      return product;
    },
    enabled: !!id,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: async () => {
      const { order } = await medusaClient.orders.retrieve(id);
      return order;
    },
    enabled: !!id,
  });
}

export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { customers } = await medusaClient.customers.list();
      return customers;
    },
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ["customers", id],
    queryFn: async () => {
      const { customer } = await medusaClient.customers.retrieve(id);
      return customer;
    },
    enabled: !!id,
  });
}
