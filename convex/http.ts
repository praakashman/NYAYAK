import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Webhook } from "svix";

const http = httpRouter();

const clerkWebhookHandler = httpAction(async (ctx, request) => {
  const payload = await request.text();
  const headers = request.headers;

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  let evt: any;
  try {
    evt = wh.verify(payload, {
      "svix-id": headers.get("svix-id") || "",
      "svix-timestamp": headers.get("svix-timestamp") || "",
      "svix-signature": headers.get("svix-signature") || "",
    });
  } catch (err) {
    try {
      // Log headers and a snippet of the payload to help diagnose signature mismatches..
      const headersObj = Object.fromEntries(headers.entries());
      console.error("Webhook verification failed:", err);
      console.error("Received headers:", headersObj);
      console.error(
        `Payload (first 1000 chars): ${payload && payload.length > 1000 ? payload.slice(0, 1000) + '...[truncated]' : payload}`
      );
    } catch (logErr) {
      console.error("Failed to log webhook diagnostics:", logErr);
    }

    return new Response("Unauthorized", { status: 401 });
  }

  const { type, data } = evt;

  if (type === "user.created") {
    const tokenIdentifier = `https://moving-grub-33.clerk.accounts.dev|${data.id}`;

    // Extract role from Clerk metadata
    // Check both unsafe_metadata and public_metadata
    let role = 
      data.unsafe_metadata?.role ?? 
      data.public_metadata?.role ?? 
      "user";
    
    // Handle role as object if needed
    if (typeof role === 'object' && role !== null) {
      role = role.toString() || "user";
    }

    console.log(`Creating user with role: ${role}`, { tokenIdentifier, metadata: data.unsafe_metadata });

    const userId = await ctx.runMutation(internal.users.createUser, {
      tokenIdentifier,
      name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() || "New User",
      email: data.email_addresses?.[0]?.email_address ?? "",
      image: data.image_url ?? "",
      role: role,
    });

    // If signing up as lawyer, create empty lawyer profile
    if (role === "lawyer") {
      await ctx.runMutation(internal.users.createLawyer, {
        tokenIdentifier,
        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() || "New User",
        email: data.email_addresses?.[0]?.email_address ?? "",
        phone: "",
        bio: "",
        specializations: [],
        yearsOfExperience: 0,
        rating: 0,
        availableNow: true,
      });
    }
  }

  if (type === "user.updated") {
    const tokenIdentifier = `https://moving-grub-33.clerk.accounts.dev|${data.id}`;

    // Optional: Handle user updates including role changes
    let role = 
      data.unsafe_metadata?.role ?? 
      data.public_metadata?.role;
    
    if (role && typeof role === 'object') {
      role = role.toString();
    }

    if (role) {
      // Update user role if provided
      await ctx.runMutation(internal.users.updateUserRole, {
        tokenIdentifier,
        role: role as "user" | "lawyer" | "admin",
      });
    }
  }

  if (type === "user.deleted") {
    // Optional: Handle user deletion if needed
  }

  return new Response(null, { status: 200 });
});

// Register both paths so incoming webhooks won't 404 if they hit either URL.
http.route({ path: "/clerk-users-webhook", method: "POST", handler: clerkWebhookHandler });
http.route({ path: "/clerk-webhook", method: "POST", handler: clerkWebhookHandler });

// Temporary seed endpoint to insert a dummy user for visualization.
// Protect with a secret query param `?secret=...` set in `SEED_SECRET` env var.
http.route({
  path: "/seed-dummy",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const secret = url.searchParams.get("secret") || "";
    if (secret !== (process.env.SEED_SECRET || "")) {
      return new Response("Forbidden", { status: 403 });
    }

    // Dummy data
    const tokenIdentifier = `seed|dummy-${Date.now()}`;
    const name = "Seeded User";
    const email = `seed+${Date.now()}@example.com`;
    const image = "";

    try {
      const id = await ctx.runMutation(internal.users.createUser, {
        tokenIdentifier,
        name,
        email,
        image,
      });

      return new Response(JSON.stringify({ insertedId: id }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Seeding failed:", err);
      return new Response("Error", { status: 500 });
    }
  }),
});

// Seed lawyers endpoint
http.route({
  path: "/seed-lawyers",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
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

    try {
      const seededLawyers = [];

      for (const lawyer of lawyerData) {
        const clerkId = `seeded-lawyer-${lawyer.email.replace("@", "-").replace(".", "-")}`;

        const userId = await ctx.runMutation(internal.users.createLawyer, {
          tokenIdentifier: clerkId,
          name: lawyer.name,
          email: lawyer.email,
          phone: lawyer.phone,
          bio: lawyer.bio,
          specializations: lawyer.specializations,
          yearsOfExperience: lawyer.yearsOfExperience,
          rating: lawyer.rating,
          availableNow: lawyer.availableNow,
        });

        seededLawyers.push({
          id: userId,
          name: lawyer.name,
          email: lawyer.email,
        });
      }

      return new Response(JSON.stringify({ success: true, seededLawyers }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Lawyer seeding failed:", err);
      return new Response(JSON.stringify({ error: String(err) }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

export default http;