import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const create = mutation({
  args: {
    sessionId: v.string(),
    storageId: v.optional(v.id("_storage")),
    pictureUrl: v.optional(v.string()),
    description: v.string(),
    desiredCountry: v.string(),
  },
  returns: v.id("productRequests"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("productRequests", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const listByUser = query({
  args: { sessionId: v.string() },
  returns: v.array(
    v.object({
      _id: v.id("productRequests"),
      _creationTime: v.number(),
      sessionId: v.string(),
      storageId: v.optional(v.id("_storage")),
      pictureUrl: v.union(v.string(), v.null()),
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
    })
  ),
  handler: async (ctx, args) => {
    const requests = await ctx.db
      .query("productRequests")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .order("desc")
      .collect();

    return await Promise.all(
      requests.map(async (req) => {
        const pictureUrl = req.storageId
          ? await ctx.storage.getUrl(req.storageId)
          : (req.pictureUrl ?? null);
        return {
          ...req,
          pictureUrl: pictureUrl ?? null,
        };
      })
    );
  },
});

export const listAll = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("productRequests"),
      _creationTime: v.number(),
      sessionId: v.string(),
      storageId: v.optional(v.id("_storage")),
      pictureUrl: v.union(v.string(), v.null()),
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
    })
  ),
  handler: async (ctx) => {
    const requests = await ctx.db.query("productRequests").order("desc").collect();
    return await Promise.all(
      requests.map(async (req) => {
        const pictureUrl = req.storageId
          ? await ctx.storage.getUrl(req.storageId)
          : (req.pictureUrl ?? null);
        return {
          ...req,
          pictureUrl: pictureUrl ?? null,
        };
      })
    );
  },
});

export const respond = mutation({
  args: {
    requestId: v.id("productRequests"),
    productDetails: v.string(),
    price: v.number(),
    shippingCost: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const totalAmount = args.price + args.shippingCost;
    await ctx.db.patch(args.requestId, {
      status: "offer_sent",
      adminResponse: {
        productDetails: args.productDetails,
        price: args.price,
        shippingCost: args.shippingCost,
        totalAmount,
        respondedAt: Date.now(),
      },
    });
    return null;
  },
});

export const updateStatus = mutation({
  args: {
    requestId: v.id("productRequests"),
    status: v.union(
      v.literal("pending"),
      v.literal("offer_sent"),
      v.literal("accepted"),
      v.literal("declined")
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.requestId, { status: args.status });
    return null;
  },
});
