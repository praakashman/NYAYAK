import { v } from "convex/values";
import { internalMutation, mutation, action, query } from "./_generated/server";

export const createUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    name: v.string(),
    email: v.string(),
    image: v.string(),
    role: v.optional(v.union(v.literal("user"), v.literal("lawyer"), v.literal("admin"))),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.tokenIdentifier))
      .unique();

    if (existingUser) return existingUser._id;

    return await ctx.db.insert("users", {
      clerkId: args.tokenIdentifier,
      name: args.name,
      email: args.email,
      image: args.image,
      role: args.role || "user",
    });
  },
});

export const createLawyer = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    bio: v.string(),
    specializations: v.array(v.string()),
    yearsOfExperience: v.number(),
    rating: v.number(),
    availableNow: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.tokenIdentifier))
      .unique();

    let userId: any;
    if (existingUser) {
      userId = existingUser._id;
    } else {
      userId = await ctx.db.insert("users", {
        clerkId: args.tokenIdentifier,
        name: args.name,
        email: args.email,
        image: "",
        role: "lawyer",
      });
    }

    // Check if lawyer profile already exists
    const existingLawyer = await ctx.db
      .query("lawyers")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (existingLawyer) {
      return userId;
    }

    // Create lawyer profile in separate table
    await ctx.db.insert("lawyers", {
      userId: userId,
      phone: args.phone,
      bio: args.bio,
      specializations: args.specializations,
      yearsOfExperience: args.yearsOfExperience,
      rating: args.rating,
      availableNow: args.availableNow ?? true,
    });

    return userId;
  },
});

export const seedLawyer = mutation({
  args: {
    tokenIdentifier: v.string(),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    bio: v.string(),
    specializations: v.array(v.string()),
    yearsOfExperience: v.number(),
    rating: v.number(),
    availableNow: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q: any) => q.eq("clerkId", args.tokenIdentifier))
      .unique();

    let userId: any;
    if (existingUser) {
      userId = existingUser._id;
    } else {
      userId = await ctx.db.insert("users", {
        clerkId: args.tokenIdentifier,
        name: args.name,
        email: args.email,
        image: "",
        role: "lawyer",
      });
    }

    // Create lawyer profile
    const existingLawyer = await ctx.db
      .query("lawyers")
      .withIndex("by_userId", (q: any) => q.eq("userId", userId))
      .unique();

    if (!existingLawyer) {
      await ctx.db.insert("lawyers", {
        userId: userId,
        phone: args.phone,
        bio: args.bio,
        specializations: args.specializations,
        yearsOfExperience: args.yearsOfExperience,
        rating: args.rating,
        availableNow: args.availableNow ?? true,
      });
    }
    
    return userId;
  },
});

export const seedAllLawyers = mutation({
  handler: async (ctx) => {
    const lawyerData = [
      {
        name: "Rajesh Kumar",
        email: "rajesh@legalservices.com",
        phone: "+91-9876543210",
        specializations: ["Constitutional Law", "Administrative Law"],
        yearsOfExperience: 15,
        rating: 4.8,
        bio: "Expert in constitutional matters with 15 years of experience",
        availableNow: true,
      },
      {
        name: "Priya Sharma",
        email: "priya@legalservices.com",
        phone: "+91-9876543211",
        specializations: ["Family Law", "Domestic Relations"],
        yearsOfExperience: 12,
        rating: 4.9,
        bio: "Specialized in family law cases with compassionate approach",
        availableNow: true,
      },
      {
        name: "Arjun Singh",
        email: "arjun@legalservices.com",
        phone: "+91-9876543212",
        specializations: ["Corporate Law", "Business Law", "Contracts"],
        yearsOfExperience: 18,
        rating: 4.7,
        bio: "Leading corporate lawyer with extensive business law expertise",
        availableNow: false,
      },
      {
        name: "Neha Gupta",
        email: "neha@legalservices.com",
        phone: "+91-9876543213",
        specializations: ["Criminal Law", "Litigation"],
        yearsOfExperience: 14,
        rating: 4.8,
        bio: "Expert criminal defense and prosecution specialist",
        availableNow: true,
      },
      {
        name: "Vikram Patel",
        email: "vikram@legalservices.com",
        phone: "+91-9876543214",
        specializations: ["Property Law", "Real Estate"],
        yearsOfExperience: 16,
        rating: 4.6,
        bio: "Veteran in property and real estate transactions",
        availableNow: true,
      },
      {
        name: "Anjali Verma",
        email: "anjali@legalservices.com",
        phone: "+91-9876543215",
        specializations: ["Labor Law", "Employment Law"],
        yearsOfExperience: 11,
        rating: 4.7,
        bio: "Focused on workers' rights and employment disputes",
        availableNow: true,
      },
    ];

    const seededLawyers = [];

    for (const lawyer of lawyerData) {
      const clerkId = `seeded-lawyer-${lawyer.email.replace("@", "-").replace(".", "-")}`;

      // Check if user already exists
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
        .unique();

      let userId = existingUser?._id;
      if (!userId) {
        userId = await ctx.db.insert("users", {
          clerkId: clerkId,
          name: lawyer.name,
          email: lawyer.email,
          image: "",
          role: "lawyer",
        });
      }

      // Check if lawyer profile exists
      const existingLawyer = await ctx.db
        .query("lawyers")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .unique();

      if (!existingLawyer) {
        await ctx.db.insert("lawyers", {
          userId: userId,
          phone: lawyer.phone,
          bio: lawyer.bio,
          specializations: lawyer.specializations,
          yearsOfExperience: lawyer.yearsOfExperience,
          rating: lawyer.rating,
          availableNow: lawyer.availableNow,
        });
      }

      seededLawyers.push({
        id: userId,
        name: lawyer.name,
        email: lawyer.email,
      });
    }

    return seededLawyers;
  },
});

export const syncUser = mutation({
  args: {
    role: v.optional(v.union(v.literal("user"), v.literal("lawyer"), v.literal("admin"))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
      .unique();

    let userId: any;

    if (existingUser) {
      const updates: any = {};
      
      // Update role if provided
      if (args.role) updates.role = args.role;
      
      // Update basic info from identity if changed
      if (identity.name && identity.name !== existingUser.name) updates.name = identity.name;
      if (identity.email && identity.email !== existingUser.email) updates.email = identity.email;
      if (identity.pictureUrl && identity.pictureUrl !== existingUser.image) updates.image = identity.pictureUrl;

      if (Object.keys(updates).length > 0) {
        await ctx.db.patch(existingUser._id, updates);
      }
      
      userId = existingUser._id;
    } else {
      userId = await ctx.db.insert("users", {
        name: identity.name ?? "New User",
        email: identity.email ?? "no-email",
        clerkId: identity.tokenIdentifier,
        image: identity.pictureUrl ?? "",
        role: args.role ?? "user",
      });
    }

    // If user role is lawyer, create lawyer profile
    if (args.role === "lawyer") {
      const existingLawyer = await ctx.db
        .query("lawyers")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .unique();

      if (!existingLawyer) {
        await ctx.db.insert("lawyers", {
          userId: userId,
          phone: "",
          bio: "",
          specializations: [],
          yearsOfExperience: 0,
          rating: 0,
          availableNow: true,
        });
      }
    }

    return userId;
  },
});

export const updateLawyerProfile = mutation({
  args: {
    phone: v.optional(v.string()),
    bio: v.optional(v.string()),
    specializations: v.optional(v.array(v.string())),
    yearsOfExperience: v.optional(v.number()),
    availableNow: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // Get user data
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
      .unique();

    if (!user) return null;

    // Get lawyer profile
    const lawyer = await ctx.db
      .query("lawyers")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();

    if (!lawyer) return null;

    // Update lawyer profile
    const updates: any = {};
    if (args.phone !== undefined) updates.phone = args.phone;
    if (args.bio !== undefined) updates.bio = args.bio;
    if (args.specializations !== undefined) updates.specializations = args.specializations;
    if (args.yearsOfExperience !== undefined) updates.yearsOfExperience = args.yearsOfExperience;
    if (args.availableNow !== undefined) updates.availableNow = args.availableNow;

    await ctx.db.patch(lawyer._id, updates);

    return lawyer._id;
  },
});

export const getLawyerProfile = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // Get user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
      .unique();

    if (!user || user.role !== "lawyer") return null;

    // Get lawyer profile
    const lawyer = await ctx.db
      .query("lawyers")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();

    return {
      userId: user._id,
      name: user.name,
      email: user.email,
      phone: lawyer?.phone || "",
      bio: lawyer?.bio || "",
      specializations: lawyer?.specializations || [],
      yearsOfExperience: lawyer?.yearsOfExperience || 0,
      availableNow: lawyer?.availableNow ?? true,
    };
  },
});

export const updateUserRole = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    role: v.union(v.literal("user"), v.literal("lawyer"), v.literal("admin")),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.tokenIdentifier))
      .unique();

    if (existingUser) {
      await ctx.db.patch(existingUser._id, { role: args.role });
    }
  },
});
