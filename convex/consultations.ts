import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Request a lawyer
export const request = mutation({
  args: {
    lawyerId: v.id("lawyers"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
      .unique();

    if (!user) throw new Error("User not found");

    const consultationId = await ctx.db.insert("consultations", {
      lawyerId: args.lawyerId,
      userId: user._id,
      status: "pending",
      notes: args.notes,
      scheduledAt: Date.now(),
    });

    return consultationId;
  },
});

// Update consultation status (Accept/Reject/Complete)
export const updateStatus = mutation({
  args: {
    consultationId: v.id("consultations"),
    status: v.union(v.literal("accepted"), v.literal("rejected"), v.literal("completed")),
  },
  handler: async (ctx, args) => {
    // In a real app, verify the user is the lawyer for this consultation
    const consultation = await ctx.db.get(args.consultationId);
    if (!consultation) throw new Error("Consultation not found");

    await ctx.db.patch(args.consultationId, { status: args.status });
  },
});

// Get consultations for the logged-in user
export const getMyConsultations = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
      .unique();

    if (!user) return [];

    // Crude fetch - in production, check if user is a lawyer or regular user
    // If regular user:
    const userConsultations = await ctx.db
      .query("consultations")
      .withIndex("by_user_status", (q) => q.eq("userId", user._id))
      .collect();

    // Ideally, we'd also check if they are a lawyer and  fetch those consultations too
    return userConsultations;
  },
});
