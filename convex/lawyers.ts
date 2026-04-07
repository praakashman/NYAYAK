import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    specialization: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get all lawyers with their profiles
    const lawyerProfiles = await ctx.db.query("lawyers").collect();

    // Get user data for each lawyer
    const lawyers = await Promise.all(
      lawyerProfiles.map(async (profile) => {
        const user = await ctx.db.get(profile.userId);
        return {
          _id: profile._id,
          userId: profile.userId,
          name: user?.name || "Unknown",
          email: user?.email || "",
          image: user?.image || "",
          phone: profile.phone,
          bio: profile.bio,
          specializations: profile.specializations,
          yearsOfExperience: profile.yearsOfExperience,
          rating: profile.rating,
          availableNow: profile.availableNow,
        };
      })
    );

    // Filter by specialization if provided
    if (args.specialization) {
      const spec = args.specialization.toLowerCase();
      return lawyers.filter((l) =>
        l.specializations.some((s) => s.toLowerCase().includes(spec))
      );
    }

    // Sort by availability and rating
    return lawyers
      .sort((a, b) => {
        if (a.availableNow !== b.availableNow) {
          return (b.availableNow ? 1 : 0) - (a.availableNow ? 1 : 0);
        }
        return (b.rating || 0) - (a.rating || 0);
      });
  },
});

// Get lawyers by specialization
export const bySpecialization = query({
  args: {
    specialization: v.string(),
  },
  handler: async (ctx, args) => {
    const lawyerProfiles = await ctx.db.query("lawyers").collect();

    const spec = args.specialization.toLowerCase();
    const filtered = lawyerProfiles.filter((profile) =>
      profile.specializations.some((s) => s.toLowerCase().includes(spec))
    );

    // Get user data for filtered lawyers
    const lawyers = await Promise.all(
      filtered.map(async (profile) => {
        const user = await ctx.db.get(profile.userId);
        return {
          _id: profile._id,
          userId: profile.userId,
          name: user?.name || "Unknown",
          email: user?.email || "",
          image: user?.image || "",
          phone: profile.phone,
          bio: profile.bio,
          specializations: profile.specializations,
          yearsOfExperience: profile.yearsOfExperience,
          rating: profile.rating,
          availableNow: profile.availableNow,
        };
      })
    );

    return lawyers.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  },
});

export const toggleAvailability = mutation({
  args: {
    lawyerId: v.id("lawyers"),
  },
  handler: async (ctx, args) => {
    const lawyer = await ctx.db.get(args.lawyerId);
    if (!lawyer) return null;

    await ctx.db.patch(args.lawyerId, {
      availableNow: !lawyer.availableNow,
    });

    return lawyer;
  },
});

// Content-based recommendation system for lawyers
export const recommend = query({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.query) return [];
    
    const lawyerProfiles = await ctx.db.query("lawyers").collect();
    
    // Extract keywords from the query
    const rawQuery = args.query.toLowerCase();
    // Remove punctuation and common stop words
    const stopWords = new Set(["the", "and", "a", "to", "of", "in", "i", "is", "that", "it", "on", "you", "this", "for", "but", "with", "are", "have", "be", "at", "or", "as", "was", "so", "if", "out", "not"]);
    const words = rawQuery.replace(/[^a-zA-Z0-9 ]/g, "").split(/\s+/);
    const keywords = words.filter(w => w.length > 2 && !stopWords.has(w));
    
    const lawyers = await Promise.all(
      lawyerProfiles.map(async (profile) => {
        const user = await ctx.db.get(profile.userId);
        
        let score = 0;
        let matchReasons = [];
        
        // 1. Specialization Match (Highest Weight: 15 points)
        // Check if the query itself is one of our specialities or closely matches
        const exactSpecializationMatch = profile.specializations.some(s => 
          rawQuery.includes(s.toLowerCase()) || s.toLowerCase().includes(rawQuery)
        );
        if (exactSpecializationMatch) {
          score += 20;
          matchReasons.push("Specializes exactly in your field");
        }
        
        // 2. Keyword Match in Specializations (Weight: 5 points per keyword)
        const matchedSpecs = profile.specializations.filter(s => 
          keywords.some(k => s.toLowerCase().includes(k))
        );
        if (!exactSpecializationMatch && matchedSpecs.length > 0) {
          score += matchedSpecs.length * 5;
          matchReasons.push("Specialization matches your case details");
        }
        
        // 3. Keyword Match in Bio (Weight: 2 points per occurrence)
        const bioLower = profile.bio.toLowerCase();
        let bioMatches = 0;
        keywords.forEach(k => {
          if (bioLower.includes(k)) bioMatches++;
        });
        if (bioMatches > 0) {
          score += bioMatches * 2;
          matchReasons.push("Bio matches your case details");
        }
        
        // 4. Rating & Experience bonuses (Weight: up to 5 points each)
        score += (profile.rating || 0); // 1-5 points
        score += Math.min(profile.yearsOfExperience * 0.2, 5); // up to 5 points
        
        // 5. Availability bonus (Weight: 3 points)
        if (profile.availableNow) {
          score += 3;
        }
        
        // Base matching requirement: Must have at least some relevance
        if (score < 3 && !profile.availableNow && profile.rating < 4) {
          // If irrelevant, score is 0
          score = 0;
        }

        return {
          _id: profile._id,
          userId: profile.userId,
          name: user?.name || "Unknown",
          email: user?.email || "",
          image: user?.image || "",
          phone: profile.phone,
          bio: profile.bio,
          specializations: profile.specializations,
          yearsOfExperience: profile.yearsOfExperience,
          rating: profile.rating,
          availableNow: profile.availableNow,
          relevanceScore: score,
          matchReasons: Array.from(new Set(matchReasons)).slice(0, 2), // Keep top 2 reasons
        };
      })
    );

    // Filter out zero scores and sort by score descending
    return lawyers
      .filter(l => l.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  },
});

export const getMyStats = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { activeCases: 0, pendingConsults: 0, profileViews: 0, documents: 0 };

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
      .unique();

    if (!user) return { activeCases: 0, pendingConsults: 0, profileViews: 0, documents: 0 };

    const lawyer = await ctx.db
      .query("lawyers")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();

    if (!lawyer) return { activeCases: 0, pendingConsults: 0, profileViews: 0, documents: 0 };

    const consultations = await ctx.db
      .query("consultations")
      .withIndex("by_lawyer_status", (q) => q.eq("lawyerId", lawyer._id))
      .collect();

    const pendingConsults = consultations.filter(c => c.status === "pending").length;
    const activeCases = consultations.filter(c => c.status === "accepted").length;

    return {
      activeCases,
      pendingConsults,
      profileViews: 0,
      documents: 0
    };
  }
});
