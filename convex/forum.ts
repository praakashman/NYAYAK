import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// 1. List all forum posts with author details
export const listPosts = query({
  args: {
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let postsQuery = ctx.db.query("forum_posts").order("desc");
    
    if (args.category) {
      postsQuery = ctx.db.query("forum_posts")
        .withIndex("by_category", (q) => q.eq("category", args.category))
        .order("desc");
    }

    const posts = await postsQuery.collect();

    return Promise.all(
      posts.map(async (post) => {
        const author = await ctx.db.get(post.authorId);
        
        // Get comment count
        const comments = await ctx.db
          .query("forum_comments")
          .withIndex("by_postId", (q) => q.eq("postId", post._id))
          .collect();

        return {
          ...post,
          authorName: author?.name || "Unknown User",
          authorRole: author?.role,
          authorImage: author?.image,
          commentCount: comments.length,
        };
      })
    );
  },
});

// 2. Create a new forum post
export const createPost = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    category: v.optional(v.string()),
    clerkId: v.string(), // To identify user
  },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    const user = users.find(u => u.clerkId && u.clerkId.includes(args.clerkId));

    if (!user) throw new Error("User not found");

    return await ctx.db.insert("forum_posts", {
      title: args.title,
      content: args.content,
      authorId: user._id,
      category: args.category,
      upvotes: 0,
    });
  },
});

// 3. Add a comment to a post
export const addComment = mutation({
  args: {
    postId: v.id("forum_posts"),
    content: v.string(),
    parentId: v.optional(v.id("forum_comments")),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    const user = users.find(u => u.clerkId && u.clerkId.includes(args.clerkId));

    if (!user) throw new Error("User not found");

    return await ctx.db.insert("forum_comments", {
      postId: args.postId,
      authorId: user._id,
      content: args.content,
      parentId: args.parentId,
      upvotes: 0,
    });
  },
});

// 4. Get Post Comments with Graph/Tree based traversal (DFS to get chronological replies mapped to parents)
export const getCommentsAndTraverse = query({
  args: {
    postId: v.id("forum_posts"),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("forum_comments")
      .withIndex("by_postId", (q) => q.eq("postId", args.postId))
      .collect();

    // Map user data
    const commentsWithUsers = await Promise.all(
      comments.map(async (c) => {
        const author = await ctx.db.get(c.authorId);
        return {
          ...c,
          authorName: author?.name || "Unknown",
          authorRole: author?.role,
          authorImage: author?.image,
        };
      })
    );

    // Build the graph using adjacency list for threading
    // BFS/DFS mapping: Parent -> Children mapping
    const graph: Record<string, typeof commentsWithUsers> = {};
    const roots: typeof commentsWithUsers = [];

    commentsWithUsers.forEach((comment) => {
      graph[comment._id] = [];
    });

    // Populate graph edges
    commentsWithUsers.forEach((comment) => {
      if (comment.parentId && graph[comment.parentId]) {
        graph[comment.parentId].push(comment);
      } else {
        roots.push(comment);
      }
    });

    // Sort roots & children chronologically (by _creationTime)
    roots.sort((a, b) => a._creationTime - b._creationTime);
    for (const key in graph) {
      graph[key].sort((a, b) => a._creationTime - b._creationTime);
    }

    // Depth-First Search (DFS) Traversal function
    const flattenTreeDFS = (
      nodeList: typeof commentsWithUsers,
      depth = 0
    ): (typeof commentsWithUsers[0] & { depth: number })[] => {
      let result: any[] = [];
      for (const node of nodeList) {
        result.push({ ...node, depth });
        // Recursively add children using graph
        const children = graph[node._id] || [];
        if (children.length > 0) {
          result = result.concat(flattenTreeDFS(children, depth + 1));
        }
      }
      return result;
    };

    // Return the flattened DFS thread traversal
    return flattenTreeDFS(roots);
  },
});

// 5. Upvote a Post or Comment
export const toggleUpvote = mutation({
  args: {
    itemId: v.union(v.id("forum_posts"), v.id("forum_comments")),
    itemType: v.union(v.literal("post"), v.literal("comment")),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    const user = users.find(u => u.clerkId && u.clerkId.includes(args.clerkId));
    if (!user) return;

    // Check if already upvoted
    const existing = await ctx.db
      .query("forum_upvotes")
      .withIndex("by_user_item", (q) => 
        q.eq("userId", user._id).eq("itemId", args.itemId)
      )
      .first();

    const table = args.itemType === "post" ? "forum_posts" : "forum_comments";
    const item = await ctx.db.get(args.itemId) as any;
    if (!item) return;

    if (existing) {
      await ctx.db.delete(existing._id);
      await ctx.db.patch(args.itemId as any, { upvotes: (item.upvotes || 1) - 1 });
      return { action: "removed" };
    } else {
      await ctx.db.insert("forum_upvotes", {
        userId: user._id,
        itemId: args.itemId,
        itemType: args.itemType,
      });
      await ctx.db.patch(args.itemId as any, { upvotes: (item.upvotes || 0) + 1 });
      return { action: "added" };
    }
  },
});

// 6. Basic PageRank / Reputation Calculation for Influential Users
export const getTopCreators = query({
  handler: async (ctx) => {
    // In a real huge distributed system, PageRank runs as a Spark/Hadoop batch job on a graph of AuthorA -> AuthorB interactions.
    // For this real-time implementation, we calculate a graph centrality proxy:
    // Nodes: Users. Edges: Upvotes and Replies received from others.
    
    const allPosts = await ctx.db.query("forum_posts").collect();
    const allComments = await ctx.db.query("forum_comments").collect();
    const allUsers = await ctx.db.query("users").collect();
    
    // Initialize scores
    let userScores: Record<string, number> = {};
    allUsers.forEach(u => userScores[u._id] = 1); // Base score of 1

    // Pass 1: Give weights based on raw interaction volume
    // Getting a comment on your post = +2 weight, getting an upvote = +3 weight
    // This is our adjacency interaction logic.
    
    allPosts.forEach(p => {
      userScores[p.authorId] = (userScores[p.authorId] || 0) + (p.upvotes * 3);
    });

    allComments.forEach(c => {
      userScores[c.authorId] = (userScores[c.authorId] || 0) + (c.upvotes * 3);
      if (c.parentId) {
        // Find parent author
        const parent = allComments.find(pc => pc._id === c.parentId);
        if (parent && parent.authorId !== c.authorId) {
           // Parent gets PageRank influence from the reply
           userScores[parent.authorId] += 2;
        }
      } else {
        const parentPost = allPosts.find(p => p._id === c.postId);
        if (parentPost && parentPost.authorId !== c.authorId) {
          userScores[parentPost.authorId] += 2;
        }
      }
    });

    // Map to user objects and sort to get ranking
    const rankedNodes = allUsers.map(u => ({
      _id: u._id,
      name: u.name || "Unknown",
      image: u.image,
      points: userScores[u._id] || 0
    })).sort((a, b) => b.points - a.points).slice(0, 10); // Top 10

    return rankedNodes;
  }
});

// 7. Seed Dummy Data for Testing DFS and PageRank Algorithm
export const seedDummyData = mutation({
  handler: async (ctx) => {
    // 1. Create dummy users
    const u1 = await ctx.db.insert("users", { name: "Sita Khadka", email: "sita@dummy.com", clerkId: "dummy_clerk_1", role: "user", image: "https://i.pravatar.cc/150?u=sita" });
    const u2 = await ctx.db.insert("users", { name: "Ram Thapa", email: "ram@dummy.com", clerkId: "dummy_clerk_2", role: "lawyer", image: "https://i.pravatar.cc/150?u=ram" });
    const u3 = await ctx.db.insert("users", { name: "Gita Sharma", email: "gita@dummy.com", clerkId: "dummy_clerk_3", role: "user", image: "https://i.pravatar.cc/150?u=gita" });
    const u4 = await ctx.db.insert("users", { name: "Hari Bahadur", email: "hari@dummy.com", clerkId: "dummy_clerk_4", role: "user", image: "https://i.pravatar.cc/150?u=hari" });

    // 2. Create posts
    const p1 = await ctx.db.insert("forum_posts", {
      title: "Ancestor's Property Division Issue",
      content: "My grandfather passed away without a will. My uncles are claiming the entire property. How do we file a partition suit in Nepal?",
      authorId: u1,
      category: "Property Law",
      upvotes: 12,
    });

    const p2 = await ctx.db.insert("forum_posts", {
      title: "Child custody after divorce",
      content: "What are the general rules for child custody in Nepal for children under 5 years old? Asking for a friend who is going through a tough time.",
      authorId: u3,
      category: "Family Law",
      upvotes: 8,
    });

    // 3. Create comments (DFS nesting)
    const c1 = await ctx.db.insert("forum_comments", {
      postId: p1,
      authorId: u2,
      content: "According to the Muluki Civil Code, you have equal rights to the ancestral property. You must file a 'Banda' (partition) case at the District Court. Do not wait too long.",
      upvotes: 24,
    });

    const c2 = await ctx.db.insert("forum_comments", {
      postId: p1,
      parentId: c1,
      authorId: u1,
      content: "Thank you Ram sir! Do I need to bring all the lalpurja (land certificates) physically to the court?",
      upvotes: 3,
    });

    const c3 = await ctx.db.insert("forum_comments", {
      postId: p1,
      parentId: c2,
      authorId: u2,
      content: "Photocopies work initially for filing the complaint, but you will absolutely need the originals or verified copies from the Land Revenue Office (Malpot) during the hearings.",
      upvotes: 6,
    });

    const c4 = await ctx.db.insert("forum_comments", {
      postId: p1,
      authorId: u4,
      content: "I am facing the exact same issue with my inherited land in Pokhara. The bureaucracy is tough!",
      upvotes: 5,
    });

    const c5 = await ctx.db.insert("forum_comments", {
      postId: p2,
      authorId: u2,
      content: "By default, custody of minors under 5 years old typically goes to the mother under Nepalese family law, unless she is proven unfit in court.",
      upvotes: 15,
    });

    return "Successfully seeded forum dummy data with DFS trees and PageRank weights!";
  }
});


