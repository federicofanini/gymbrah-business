"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import type { ActionResponse } from "@/actions/types/action-response";
import { appErrors } from "@/actions/types/errors";
import {
  exercises,
  categories,
} from "@/components/blackboard/workout/create-workout/exercises/exercises-list";
import { prisma } from "@/lib/db";

const schema = z.object({
  category: z.enum([
    categories.warmUp,
    categories.upperBody,
    categories.lowerBody,
    categories.core,
    categories.cardio,
    categories.flexibilityMobility,
    categories.functionalFullBody,
    categories.coolDown,
  ]),
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

      const exercise = await prisma.exercises.create({
        data: {
          category: input.parsedInput.category,
          name: input.parsedInput.name,
          muscles: input.parsedInput.muscles,
          outcomes: input.parsedInput.outcomes,
          reps: input.parsedInput.reps,
          sets: input.parsedInput.sets,
          duration: input.parsedInput.duration,
          weight: input.parsedInput.weight,
          creator_id: user.id,
          creator_name: "gymbrah",
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
          category: exercise.category || categories.functionalFullBody, // Use the category from exercise or default
          name: exercise.name,
          muscles: exercise.muscles,
          outcomes: exercise.outcomes,
          reps: null,
          sets: null,
          duration: null,
          weight: null,
          creator_id: user.id,
          creator_name: "gymbrah",
        })
      );

      const createdExercises = await prisma.exercises.createMany({
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
