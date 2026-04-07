// Seed script to populate Convex database with lawyer data
// This file contains the lawyer data to be seeded via the /api/seed-lawyers endpoint

const LAWYERS_DATA = [
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

console.log("📋 Lawyer seed data prepared:");
console.log(`   Total lawyers: ${LAWYERS_DATA.length}`);
LAWYERS_DATA.forEach((lawyer) => {
  console.log(`   - ${lawyer.name} (${lawyer.specializations.join(", ")})`);
});

console.log("\n💡 To seed this data:");
console.log("   1. Start your Next.js dev server: npm run dev");
console.log("   2. Visit: http://localhost:3000/api/seed-lawyers");
console.log("   3. Check your Convex dashboard for the seeded lawyers");

module.exports = { LAWYERS_DATA };
