"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import type { ActionResponse } from "@/actions/types/action-response";
import { prisma } from "@/lib/db";
import { appErrors } from "@/actions/types/errors";

const schema = z.object({
  workoutId: z.string(),
});

export const getWorkoutExercises = createSafeActionClient()
  .schema(schema)
  .action(async ({ parsedInput }): Promise<ActionResponse> => {
    try {
      const workoutExercises = await prisma.workout_exercise.findMany({
        where: {
          workout_id: parsedInput.workoutId,
        },
        include: {
          exercise: {
            select: {
              id: true,
              name: true,
              body_part: true,
              equipment: true,
              target: true,
              gif_url: true,
              secondary_muscles: true,
            },
          },
        },
      });

      if (!workoutExercises.length) {
        return {
          success: false,
          error: appErrors.NOT_FOUND,
        };
      }

      return {
        success: true,
        data: workoutExercises,
      };
    } catch (error) {
      console.error("Error fetching workout exercises:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
