import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getSessions = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
      .unique();

    if (!user) return [];

    const sessions = await ctx.db
      .query("chat_sessions")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return sessions;
  },
});

export const getMessages = query({
  args: { sessionId: v.id("chat_sessions") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chat_messages")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .order("asc")
      .collect();
  },
});

export const createSession = mutation({
  args: { title: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated call");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
      .unique();

    if (!user) throw new Error("User not found");

    return await ctx.db.insert("chat_sessions", {
      userId: user._id,
      title: args.title,
    });
  },
});

export const addMessage = mutation({
  args: {
    sessionId: v.id("chat_sessions"),
    text: v.string(),
    sender: v.union(v.literal("user"), v.literal("assistant")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("chat_messages", {
      sessionId: args.sessionId,
      text: args.text,
      sender: args.sender,
      timestamp: Date.now(),
    });
  },
});

export const deleteSession = mutation({
    args: { sessionId: v.id("chat_sessions") },
    handler: async (ctx, args) => {
        // delete all messages first
        const messages = await ctx.db
          .query("chat_messages")
          .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
          .collect();
        
        for (const msg of messages) {
            await ctx.db.delete(msg._id);
        }
        
        await ctx.db.delete(args.sessionId);
    }
})
