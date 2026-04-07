import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

export async function GET(request: NextRequest) {
  try {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_CONVEX_URL not configured" },
        { status: 500 }
      );
    }

    const client = new ConvexHttpClient(convexUrl);

    // Call the seedAllLawyers mutation
    const result = await client.mutation(api.users.seedAllLawyers);

    return NextResponse.json({
      success: true,
      message: `Seeded ${result?.length || 0} lawyers`,
      lawyers: result || [],
    });
  } catch (error) {
    console.error("Error seeding lawyers:", error);
    return NextResponse.json(
      { error: "Failed to seed lawyers", details: String(error) },
      { status: 500 }
    );
  }
}
