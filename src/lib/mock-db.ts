// Mock database for frontend demo
export const mockDB = {
  products: [
    { id: "1", title: "Maglietta Classic", price: 29.99, status: "ACTIVE", inventory: 100, images: [] },
    { id: "2", title: "Felpa Hoodie", price: 49.99, status: "ACTIVE", inventory: 50, images: [] },
  ],
  orders: [
    { id: "101", orderNumber: 1001, customerName: "Mario Rossi", customerEmail: "mario@test.com", total: 29.99, status: "DELIVERED", createdAt: new Date().toISOString() },
    { id: "102", orderNumber: 1002, customerName: "Luigi Verdi", customerEmail: "luigi@test.com", total: 49.99, status: "PROCESSING", createdAt: new Date().toISOString() },
  ],
  members: [
    { id: "1", email: "mario@test.com", role: "VIEWER" as const, userId: "user-1", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ],
  storeConfig: {
    theme: "minimal",
    primaryColor: "#000000",
    fontFamily: "Inter",
    showFeaturedProducts: true,
    currency: "EUR",
    heroTitle: "Benvenuto nel mio Store",
    heroDescription: "Trova i migliori prodotti qui.",
    heroImage: ""
  }
};
