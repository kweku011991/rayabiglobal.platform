import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
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
  },
  returns: v.id("orders"),
  handler: async (ctx, args) => {
    const orderId = await ctx.db.insert("orders", {
      ...args,
      paymentStatus: "pending",
      orderStatus: "payment_confirmed",
      trackingUpdates: [
        { status: "Order Manifested", timestamp: Date.now() },
      ],
      createdAt: Date.now(),
    });

    if (args.requestId) {
      await ctx.db.patch(args.requestId, { status: "accepted" });
    }

    return orderId;
  },
});

export const listByUser = query({
  args: { sessionId: v.string() },
  returns: v.array(
    v.object({
      _id: v.id("orders"),
      _creationTime: v.number(),
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
    })
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .order("desc")
      .collect();
  },
});

export const listAll = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("orders"),
      _creationTime: v.number(),
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
    })
  ),
  handler: async (ctx) => {
    return await ctx.db.query("orders").order("desc").collect();
  },
});

export const updateStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(
      v.literal("payment_confirmed"),
      v.literal("sourcing_in_progress"),
      v.literal("item_received_warehouse"),
      v.literal("shipped_to_ghana"),
      v.literal("cleared_at_customs"),
      v.literal("out_for_delivery"),
      v.literal("delivered")
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");

    const statusMap: Record<string, string> = {
      payment_confirmed: "Payment Confirmed",
      sourcing_in_progress: "Sourcing in Progress",
      item_received_warehouse: "Item Received at Warehouse",
      shipped_to_ghana: "Shipped to Ghana",
      cleared_at_customs: "Cleared at Customs",
      out_for_delivery: "Out for Delivery",
      delivered: "Delivered",
    };

    const newUpdate = {
      status: statusMap[args.status],
      timestamp: Date.now(),
    };

    await ctx.db.patch(args.orderId, {
      orderStatus: args.status,
      trackingUpdates: [...order.trackingUpdates, newUpdate],
    });
    return null;
  },
});

export const confirmPayment = mutation({
  args: { orderId: v.id("orders") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");

    const newUpdate = {
      status: "Payment Confirmed",
      timestamp: Date.now(),
    };

    await ctx.db.patch(args.orderId, {
      paymentStatus: "paid",
      trackingUpdates: [...order.trackingUpdates, newUpdate],
    });
    return null;
  },
});

export const getStats = query({
  args: {},
  returns: v.object({
    totalSales: v.number(),
    orderCount: v.number(),
  }),
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").collect();
    const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    return {
      totalSales,
      orderCount: orders.length,
    };
  },
});
