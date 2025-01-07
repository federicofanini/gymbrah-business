"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import type { ActionResponse } from "@/actions/types/action-response";
import { appErrors } from "@/actions/types/errors";
import { exercises } from "@/components/blackboard/workout/exercises-list";
import { prisma } from "@/lib/db";

const schema = z.object({
  category: z.string(),
  name: z.string(),
  muscles: z.array(z.string()),
  outcomes: z.array(z.string()),
  reps: z.number().optional(),
  sets: z.number().optional(),
  duration: z.number().optional(),
  weight: z.number().optional(),
});

export const addExercise = createSafeActionClient()
  .schema(schema)
  .action(async (input): Promise<ActionResponse> => {
    try {
      const supabase = await createClient();

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

      const exercise = await prisma.workout_exercise.create({
        data: {
          id: crypto.randomUUID(),
          creator_id: user.id,
          category: input.parsedInput.category,
          name: input.parsedInput.name,
          muscles: input.parsedInput.muscles,
          outcomes: input.parsedInput.outcomes,
          reps: input.parsedInput.reps || 0,
          sets: input.parsedInput.sets || 0,
          duration: input.parsedInput.duration || 0,
          weight: input.parsedInput.weight || 0,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      return {
        success: true,
        data: exercise,
      };
    } catch (error) {
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });

// Bulk add exercises from exercises-list.tsx
export const bulkAddExercises = createSafeActionClient().action(
  async (): Promise<ActionResponse> => {
    try {
      const supabase = await createClient();

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

      // Convert exercises object to array of exercise records
      const exerciseRecords = Object.entries(exercises).map(
        ([_, exercise]) => ({
          id: crypto.randomUUID(),
          creator_id: user.id,
          category: "gymbrah",
          name: exercise.name,
          muscles: exercise.muscles,
          outcomes: exercise.outcomes,
          reps: 0,
          sets: 0,
          duration: 0,
          weight: 0,
          created_at: new Date(),
          updated_at: new Date(),
        })
      );

      const createdExercises = await prisma.workout_exercise.createMany({
        data: exerciseRecords,
      });

      return {
        success: true,
        data: createdExercises,
      };
    } catch (error) {
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  }
);
