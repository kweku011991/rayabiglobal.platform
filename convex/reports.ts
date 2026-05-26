import { v } from "convex/values";
import { query } from "./_generated/server";

export const getActivityReport = query({
  args: {},
  returns: v.array(
    v.object({
      sessionId: v.string(),
      entryTime: v.number(),
      exitTime: v.number(),
      requestsCount: v.number(),
      ordersCount: v.number(),
      totalSpent: v.number(),
      activities: v.array(
        v.object({
          type: v.union(v.literal("request"), v.literal("order")),
          details: v.string(),
          time: v.number(),
        })
      ),
    })
  ),
  handler: async (ctx) => {
    const sessions = await ctx.db.query("sessions").order("desc").collect();
    const report = [];

    for (const session of sessions) {
      const requests = await ctx.db
        .query("productRequests")
        .withIndex("by_sessionId", (q) => q.eq("sessionId", session.sessionId))
        .collect();

      const orders = await ctx.db
        .query("orders")
        .withIndex("by_sessionId", (q) => q.eq("sessionId", session.sessionId))
        .collect();

      const activities = [
        ...requests.map((r) => ({
          type: "request" as const,
          details: `Requested: ${r.description}`,
          time: r.createdAt,
        })),
        ...orders.map((o) => ({
          type: "order" as const,
          details: `Ordered: ${o.productDetails.name}`,
          time: o.createdAt,
        })),
      ].sort((a, b) => b.time - a.time);

      const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0);

      report.push({
        sessionId: session.sessionId,
        entryTime: session.createdAt,
        exitTime: session.lastActive,
        requestsCount: requests.length,
        ordersCount: orders.length,
        totalSpent,
        activities,
      });
    }

    return report;
  },
});
