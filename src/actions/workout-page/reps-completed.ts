"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { prisma } from "@/lib/db";
import type { ActionResponse } from "../types/action-response";

const schema = z.object({
  workoutExerciseId: z.string(),
  userId: z.string(),
  completedReps: z.number().min(0),
  setNumber: z.number().min(1),
});

export const saveCompletedReps = createSafeActionClient()
  .schema(schema)
  .action(async ({ parsedInput }): Promise<ActionResponse> => {
    try {
      const completedSet = await prisma.completed_set.create({
        data: {
          workout_exercise_id: parsedInput.workoutExerciseId,
          user_id: parsedInput.userId,
          completed_reps: parsedInput.completedReps,
          set_number: parsedInput.setNumber,
        },
      });

      return {
        success: true,
        data: completedSet,
      };
    } catch (error) {
      console.error("Error saving completed reps:", error);
      return {
        success: false,
        error: "Failed to save completed reps",
      };
    }
  });
