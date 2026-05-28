import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  sessions: defineTable({
    sessionId: v.string(),
    createdAt: v.number(),
    lastActive: v.number(),
  }).index("by_sessionId", ["sessionId"]),

  productRequests: defineTable({
    sessionId: v.string(),
    storageId: v.optional(v.id("_storage")),
    pictureUrl: v.optional(v.string()), // Fallback or direct URL
    description: v.string(),
    desiredCountry: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("offer_sent"),
      v.literal("accepted"),
      v.literal("declined")
    ),
    adminResponse: v.optional(
      v.object({
        productDetails: v.string(),
        price: v.number(),
        shippingCost: v.number(),
        totalAmount: v.number(),
        respondedAt: v.number(),
      })
    ),
    createdAt: v.number(),
  }).index("by_sessionId", ["sessionId"]),

  directProducts: defineTable({
    productName: v.string(),
    description: v.string(),
    category: v.union(
      v.literal("Watch"),
      v.literal("Bag"),
      v.literal("E-bike"),
      v.literal("Motorbike"),
      v.literal("Car"),
      v.literal("Other")
    ),
    stock: v.number(),
    pictureUrl: v.optional(v.string()), // For legacy/external URLs
    storageId: v.optional(v.id("_storage")), // For uploaded images
    year: v.optional(v.string()),
    condition: v.optional(v.string()),
    serialNumber: v.optional(v.string()),
    mileage: v.optional(v.string()),
    price: v.number(),
    shippingCost: v.number(),
    warehouseLocation: v.union(v.literal("Local"), v.literal("Abroad")),
    createdAt: v.number(),
  }),

  orders: defineTable({
    sessionId: v.string(),
    source: v.union(v.literal("request"), v.literal("direct")),
    requestId: v.optional(v.id("productRequests")),
    productId: v.optional(v.id("directProducts")),
    productDetails: v.object({
      name: v.string(),
      description: v.string(),
      price: v.number(),
      shippingCost: v.number(),
    }),
    totalAmount: v.number(),
    paymentStatus: v.union(v.literal("paid"), v.literal("pending")),
    orderStatus: v.union(
      v.literal("payment_confirmed"),
      v.literal("sourcing_in_progress"),
      v.literal("item_received_warehouse"),
      v.literal("shipped_to_ghana"),
      v.literal("cleared_at_customs"),
      v.literal("out_for_delivery"),
      v.literal("delivered")
    ),
    trackingUpdates: v.array(
      v.object({
        status: v.string(),
        timestamp: v.number(),
      })
    ),
    createdAt: v.number(),
  }).index("by_sessionId", ["sessionId"]),
});
