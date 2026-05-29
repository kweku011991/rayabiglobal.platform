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
      storageId: v.optional(v.id("_storage")),
    })
  ),
  handler: async (ctx) => {
    const products = await ctx.db.query("directProducts").order("desc").collect();
    return await Promise.all(
      products.map(async (p) => {
        const pictureUrl = p.storageId
          ? await ctx.storage.getUrl(p.storageId)
          : p.pictureUrl;
        return {
          ...p,
          pictureUrl: pictureUrl || "https://images.unsplash.com/photo-1585123334904-845d60e97b29?w=400&auto=format&fit=crop",
        };
      })
    );
  },
});

export const search = query({
  args: { 
    query: v.string(), 
    category: v.string() 
  },
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
      storageId: v.optional(v.id("_storage")),
    })
  ),
  handler: async (ctx, args) => {
    let results;
    if (args.query === "") {
      let q = ctx.db.query("directProducts");
      if (args.category !== "All") {
        results = await q.withIndex("by_category", (q) => q.eq("category", args.category as any)).order("desc").collect();
      } else {
        results = await q.order("desc").collect();
      }
    } else {
      let q = ctx.db.query("directProducts").withSearchIndex("search_products", (q) => {
        let res = q.search("productName", args.query);
        if (args.category !== "All") {
          res = res.eq("category", args.category as any);
        }
        return res;
      });
      results = await q.take(50);
    }

    return await Promise.all(
      results.map(async (p) => {
        const pictureUrl = p.storageId
          ? await ctx.storage.getUrl(p.storageId)
          : p.pictureUrl;
        return {
          ...p,
          pictureUrl: pictureUrl || "https://images.unsplash.com/photo-1585123334904-845d60e97b29?w=400&auto=format&fit=crop",
        };
      })
    );
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
    pictureUrl: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
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

export const remove = mutation({
  args: { productId: v.id("directProducts") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.productId);
    return null;
  },
});
