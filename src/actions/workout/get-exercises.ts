"use server";

import { createSafeActionClient } from "next-safe-action";
import { unstable_cache } from "next/cache";
import type { ActionResponse } from "../types/action-response";
import { appErrors } from "../types/errors";
import { prisma } from "@/lib/db";

// Cache exercises query for 4 hours
const getCachedExercises = unstable_cache(
  async () => {
    return prisma.exercises.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        muscles: true,
        outcomes: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
  },
  ["all-exercises"],
  {
    revalidate: 60 * 60 * 4, // 4 hours in seconds
  }
);

export const getExercises = createSafeActionClient().action(
  async (): Promise<ActionResponse> => {
    try {
      const exercises = await getCachedExercises();

      return {
        success: true,
        data: exercises,
      };
    } catch (error) {
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  }
);
