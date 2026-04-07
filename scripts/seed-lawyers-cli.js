#!/usr/bin/env node
/**
 * CLI script to seed lawyers into Convex database
 * Usage: npx node scripts/seed-lawyers-cli.js
 */

import { ConvexHttpClient } from "convex/browser";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://prestigious-wildcat-702.convex.cloud";

const lawyers = [
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

async function seedLawyers() {
  console.log(`Using Convex URL: ${convexUrl}\n`);

  const client = new ConvexHttpClient(convexUrl);
  const seeded = [];

  for (const lawyer of lawyers) {
    try {
      const clerkId = `seeded-lawyer-${lawyer.email.replace("@", "-").replace(".", "-")}`;

      console.log(`Seeding ${lawyer.name}...`);

      // Use the seedLawyer action
      const result = await client.mutation("users:seedLawyer", {
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

      console.log(`✓ Seeded ${lawyer.name} (ID: ${result})`);
      seeded.push({ name: lawyer.name, id: result });
    } catch (error) {
      console.error(`✗ Failed to seed ${lawyer.name}:`, error.message);
    }
  }

  console.log(`\n✓ Successfully seeded ${seeded.length} lawyers!`);
  seeded.forEach((l) => console.log(`  - ${l.name}`));
}

seedLawyers().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
