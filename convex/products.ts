import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listAll = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("directProducts"),
      _creationTime: v.number(),
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
      pictureUrl: v.string(),
      year: v.optional(v.string()),
      condition: v.optional(v.string()),
      serialNumber: v.optional(v.string()),
      mileage: v.optional(v.string()),
      price: v.number(),
      shippingCost: v.number(),
      warehouseLocation: v.union(v.literal("Local"), v.literal("Abroad")),
      createdAt: v.number(),
    })
  ),
  handler: async (ctx) => {
    return await ctx.db.query("directProducts").order("desc").collect();
  },
});

export const add = mutation({
  args: {
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
    pictureUrl: v.string(),
    year: v.optional(v.string()),
    condition: v.optional(v.string()),
    serialNumber: v.optional(v.string()),
    mileage: v.optional(v.string()),
    price: v.number(),
    shippingCost: v.number(),
    warehouseLocation: v.union(v.literal("Local"), v.literal("Abroad")),
  },
  returns: v.id("directProducts"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("directProducts", {
      ...args,
      createdAt: Date.now(),
    });
  },
});
