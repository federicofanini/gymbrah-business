"use server";

import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/db";
import type { ActionResponse } from "../types/action-response";
import { createSafeActionClient } from "next-safe-action";

export async function getWorkoutHistory(userId: string, limit = 10) {
  const workouts = await prisma.workout.findMany({
    where: {
      user_id: userId,
    },
    include: {
      exercises: true,
    },
    orderBy: {
      created_at: "desc",
    },
    take: limit,
  });

  return workouts;
}

export const getActiveWorkout = createSafeActionClient().action(
  async (): Promise<ActionResponse> => {
    try {
      const supabase = await createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return {
          success: false,
          error: "User not authenticated",
        };
      }

      const workout = await prisma.workout.findFirst({
        where: {
          user_id: user.id,
          selected: true,
        },
        include: {
          exercises: true,
        },
      });

      return {
        success: true,
        data: workout,
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to fetch active workout",
      };
    }
  }
);
