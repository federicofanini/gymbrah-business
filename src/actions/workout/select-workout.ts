"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import type { ActionResponse } from "../types/action-response";
import { appErrors } from "../types/errors";
import { prisma } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { revalidateTag, revalidatePath } from "next/cache";

const schema = z.object({
  workoutId: z.string(),
});

export const selectWorkout = createSafeActionClient()
  .schema(schema)
  .action(async (input): Promise<ActionResponse> => {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        return {
          success: false,
          error: appErrors.UNAUTHORIZED,
        };
      }

      // First, unselect all workouts for this user
      await prisma.workout.updateMany({
        where: {
          user_id: user.id,
        },
        data: {
          selected: false,
        },
      });

      // If workoutId is not empty, select the specified workout
      if (input.parsedInput.workoutId) {
        await prisma.workout.update({
          where: {
            id: input.parsedInput.workoutId,
            user_id: user.id,
          },
          data: {
            selected: true,
          },
        });
      }

      // Revalidate the cache tag for this user's selected workout
      revalidateTag(`selected-workout-${user.id}`);
      revalidatePath("/blackboard/workout");

      return {
        success: true,
        data: { success: true },
      };
    } catch (error) {
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
