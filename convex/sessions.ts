import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getOrCreate = mutation({
  args: { sessionId: v.string() },
  returns: v.object({
    _id: v.id("sessions"),
    _creationTime: v.number(),
    sessionId: v.string(),
    createdAt: v.number(),
    lastActive: v.number(),
  }),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("sessions")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { lastActive: Date.now() });
      return { ...existing, lastActive: Date.now() };
    }

    const id = await ctx.db.insert("sessions", {
      sessionId: args.sessionId,
      createdAt: Date.now(),
      lastActive: Date.now(),
    });

    const session = await ctx.db.get(id);
    return session!;
  },
});

export const get = query({
  args: { sessionId: v.string() },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("sessions"),
      _creationTime: v.number(),
      sessionId: v.string(),
      createdAt: v.number(),
      lastActive: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sessions")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .unique();
  },
});

export const getCount = query({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const sessions = await ctx.db.query("sessions").collect();
    return sessions.length;
  },
});
