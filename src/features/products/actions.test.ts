// Test obsoleto: L'implementazione di createProduct ora usa Shopify, non Prisma.
// Da riscrivere per testare l'integrazione Shopify.

// import { createProduct } from "./actions";
// import { prisma } from "@/lib/prisma";

// // Mock Prisma
// jest.mock("@/lib/prisma", () => ({
//   prisma: {
//     product: {
//       create: jest.fn(),
//     },
//   },
// }));

// describe("Product Actions", () => {
//   it("should fail validation if price is negative", async () => {
//     const formData = {
//       title: "Test Product",
//       price: -10, // Invalid
//       status: "DRAFT",
//       type: "PHYSICAL",
//       inventory: 10,
//     };

//     // We expect the Zod validation inside the action to catch this
//     // Since our action returns an object { error: ... } on failure
//     const result = await createProduct(formData as any);

//     expect(result).toHaveProperty("error");
//     expect(result.success).toBeUndefined();
//   });

//   it("should call prisma.create if data is valid", async () => {
//     const formData = {
//       title: "Valid Product",
//       price: 19.99,
//       status: "ACTIVE",
//       type: "DIGITAL",
//       inventory: 0,
//     };

//     (prisma.product.create as jest.Mock).mockResolvedValue({
//       id: "1",
//       ...formData,
//       price: "19.99",
//     });

//     const result = await createProduct(formData as any);

//     expect(result).toHaveProperty("success");
//     expect(prisma.product.create).toHaveBeenCalled();
//   });
// });