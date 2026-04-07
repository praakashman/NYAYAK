import { NextRequest, NextResponse } from "next/server";

// Proxy requests to Python backend
const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || "http://localhost:8000";

export async function GET(request: NextRequest) {
  const specialization = request.nextUrl.searchParams.get("specialization");

  try {
    // Build query string
    const queryParams = new URLSearchParams();
    if (specialization) {
      queryParams.append("specialization", specialization);
    }

    // Forward request to Python backend
    const response = await fetch(
      `${PYTHON_BACKEND_URL}/api/lawyers${queryParams.toString() ? "?" + queryParams.toString() : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Python backend error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch lawyers", details: String(error) },
      { status: 500 }
    );
  }
}
