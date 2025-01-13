"use server";

import { Client } from "@/utils/supabase/type";
import type { ActionResponse } from "../types/action-response";
import { appErrors } from "../types/errors";
import { prisma } from "@/lib/db";

export async function getExercises(supabase: Client): Promise<ActionResponse> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: appErrors.UNAUTHORIZED,
    };
  }

  try {
    const BATCH_SIZE = 100; // Process in smaller batches
    let allExercises: any[] = [];
    let skip = 0;

    // Get total count first
    const totalCount = await prisma.exercise_db.count();

    // Fetch data in batches
    while (skip < totalCount) {
      const batch = await prisma.exercise_db.findMany({
        select: {
          id: true,
          name: true,
          body_part: true,
          equipment: true,
          gif_url: true,
          target: true,
          secondary_muscles: true,
          instructions: true,
          created_at: true,
          updated_at: true,
        },
        orderBy: {
          name: "asc",
        },
        take: BATCH_SIZE,
        skip: skip,
      });

      allExercises = [...allExercises, ...batch];
      skip += BATCH_SIZE;

      // Add small delay between batches to prevent rate limiting
      if (skip < totalCount) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    return {
      success: true,
      data: allExercises,
    };
  } catch (error) {
    return {
      success: false,
      error: appErrors.UNEXPECTED_ERROR,
    };
  }
}
