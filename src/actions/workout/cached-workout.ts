import "server-only";

import { unstable_cache } from "next/cache";
import { cache } from "react";
import { createClient } from "@/utils/supabase/server";
import { getExercises } from "./get-exercises";
import { getSelectedWorkout } from "./get-workouts";
import type { ActionResponse } from "../types/action-response";
import { appErrors } from "../types/errors";
import { prisma } from "@/lib/db";

export const getCachedExercises = cache(async (): Promise<ActionResponse> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: appErrors.UNAUTHORIZED,
    };
  }

  return unstable_cache(
    async () => {
      return getExercises(supabase);
    },
    // Use a single global key for all exercises
    ["exercises"],
    {
      // Use a single global tag for all exercises
      tags: ["exercises"],
      // 30 minutes, jwt expires in 1 hour
      revalidate: 1800,
    }
  )();
});

export const getCachedSelectedWorkout = cache(
  async (): Promise<ActionResponse> => {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: appErrors.UNAUTHORIZED,
      };
    }

    return unstable_cache(
      async () => {
        return getSelectedWorkout(supabase);
      },
      // Cache key includes user ID for per-user caching
      [`selected-workout-${user.id}`],
      {
        // Tag includes user ID for targeted revalidation
        tags: [`selected-workout-${user.id}`],
        // 5 minutes since workout selection can change frequently
        revalidate: 300,
      }
    )();
  }
);

export const getCachedWorkoutFrequency = cache(
  async (): Promise<ActionResponse> => {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: appErrors.UNAUTHORIZED,
      };
    }

    return unstable_cache(
      async () => {
        try {
          const frequency = await prisma.workout_frequency.findUnique({
            where: {
              user_id: user.id,
            },
            select: {
              frequency: true,
            },
          });

          return {
            success: true,
            data: frequency,
          };
        } catch (error) {
          return {
            success: false,
            error: appErrors.UNEXPECTED_ERROR,
          };
        }
      },
      [`workout-frequency-${user.id}`],
      {
        tags: [`workout-frequency-${user.id}`],
        revalidate: 300,
      }
    )();
  }
);
