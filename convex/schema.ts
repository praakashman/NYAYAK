import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()), 
    email: v.string(), 
    clerkId: v.string(),
    image: v.optional(v.string()),
    bio: v.optional(v.string()),
    role: v.union(v.literal("user"), v.literal("lawyer"), v.literal("admin")),
  })
  .index("by_clerkId", ["clerkId"])
  .index("by_role", ["role"]),

  lawyers: defineTable({
    userId: v.id("users"),
    specializations: v.array(v.string()),
    yearsOfExperience: v.number(),
    rating: v.number(),
    phone: v.string(),
    bio: v.string(),
    availableNow: v.boolean(),
  })
  .index("by_userId", ["userId"]),

  consultations: defineTable({
    lawyerId: v.id("lawyers"),
    userId: v.id("users"),
    status: v.string(),
    notes: v.optional(v.string()),
    scheduledAt: v.number(),
  })
  .index("by_user_status", ["userId", "status"])
  .index("by_lawyer_status", ["lawyerId", "status"]),

  chat_sessions: defineTable({
    userId: v.id("users"),
    title: v.string(),
  }).index("by_userId", ["userId"]),

  chat_messages: defineTable({
    sessionId: v.id("chat_sessions"),
    text: v.string(),
    sender: v.union(v.literal("user"), v.literal("assistant")),
    timestamp: v.number(),
  }).index("by_sessionId", ["sessionId"]),

  // ----------- FORUM SCHEMA -----------
  forum_posts: defineTable({
    title: v.string(),
    content: v.string(),
    authorId: v.id("users"),
    category: v.optional(v.string()),
    upvotes: v.number(),
  }).index("by_authorId", ["authorId"])
    .index("by_category", ["category"]),

  forum_comments: defineTable({
    postId: v.id("forum_posts"),
    authorId: v.id("users"),
    content: v.string(),
    parentId: v.optional(v.id("forum_comments")), // For DFS/BFS nested threading
    upvotes: v.number(),
  }).index("by_postId", ["postId"])
    .index("by_parentId", ["parentId"]),

  forum_upvotes: defineTable({
    userId: v.id("users"),
    itemId: v.union(v.id("forum_posts"), v.id("forum_comments")),
    itemType: v.union(v.literal("post"), v.literal("comment")),
  }).index("by_item", ["itemId"])
    .index("by_user_item", ["userId", "itemId"]),

  // To cache PageRank scores to avoid recalculating on every render
  forum_user_pagerank: defineTable({
    userId: v.id("users"),
    score: v.number(),    // The calculated PageRank score
    rank: v.number(),     // 1st, 2nd, etc.
  }).index("by_userId", ["userId"])
    .index("by_score", ["score"]),
});
