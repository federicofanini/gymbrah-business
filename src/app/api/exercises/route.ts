import { NextRequest, NextResponse } from "next/server";
import { EXERCISE_API_CONFIG, BODY_PARTS, type BodyPart } from "../config";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters with defaults
    const searchParams = request.nextUrl.searchParams;
    const offset = parseInt(searchParams.get("offset") ?? "0"); // Default to 0 instead of 10
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const bodyPart = searchParams.get("bodyPart");

    // Validate body part
    if (
      !bodyPart ||
      !Object.values(BODY_PARTS).includes(bodyPart as BodyPart)
    ) {
      return NextResponse.json({ error: "Invalid body part" }, { status: 400 });
    }

    // Build API URL with query parameters
    const url = new URL(
      `/exercises/bodyPart/${bodyPart}`,
      EXERCISE_API_CONFIG.baseUrl
    );

    // Fetch all exercises for body part first
    const response = await fetch(url, {
      headers: EXERCISE_API_CONFIG.headers,
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const allExercises = await response.json();

    // Then paginate manually
    const paginatedExercises = allExercises.slice(offset, offset + limit);

    return NextResponse.json(paginatedExercises);
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
