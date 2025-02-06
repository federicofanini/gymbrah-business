"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { appErrors } from "../types/errors";
import type { ActionResponse } from "../types/action-response";
import { createClient } from "@/utils/supabase/server";
import { checkBusiness } from "../business/onboarding/check-business";
import { checkAthlete } from "../business/onboarding/check-athlete";

const exerciseSchema = z.object({
  exerciseId: z.string(),
  sets: z.number().optional(),
  reps: z.number().optional(),
  weight: z.number().optional(),
  duration: z.number().optional(),
  round: z.string().optional(),
});

const schema = z.object({
  name: z.string().min(1),
  exercises: z.array(exerciseSchema),
  businessId: z.string().optional(),
  athleteId: z.string().optional(),
});

export const createWorkout = createSafeActionClient()
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

      // Check if user is a business or athlete
      const businessCheck = await checkBusiness({
        user_id: user.id,
      });

      const athleteCheck = await checkAthlete({
        user_id: user.id,
      });

      let businessId = null;
      let athleteId = null;

      if (businessCheck?.data?.success && businessCheck.data?.data?.exists) {
        businessId = businessCheck.data.data.id;
      } else if (
        athleteCheck?.data?.success &&
        athleteCheck.data?.data?.exists
      ) {
        athleteId = athleteCheck.data.data.id;
      } else {
        return {
          success: false,
          error: appErrors.UNAUTHORIZED,
        };
      }

      // Create workout with exercises
      const workout = await prisma.workout.create({
        data: {
          name: input.parsedInput.name,
          user_id: user.id,
          business_id: businessId,
          athlete_id: athleteId,
          exercises: {
            create: input.parsedInput.exercises.map((exercise) => ({
              exercise_id: exercise.exerciseId,
              sets: exercise.sets,
              reps: exercise.reps,
              weight: exercise.weight,
              duration: exercise.duration,
              round: exercise.round,
            })),
          },
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
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
