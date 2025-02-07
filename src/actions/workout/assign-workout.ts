"use server";

import { createSafeActionClient } from "next-safe-action";
import { prisma } from "@/lib/db";
import type { ActionResponse } from "../types/action-response";
import { appErrors } from "../types/errors";
import { z } from "zod";

const schema = z.object({
  workoutId: z.string(),
  athleteId: z.string(),
  businessId: z.string().optional(),
});

export const assignWorkout = createSafeActionClient()
  .schema(schema)
  .action(async ({ parsedInput }): Promise<ActionResponse> => {
    try {
      const workoutAssignment = await prisma.workout_athlete.create({
        data: {
          workout_id: parsedInput.workoutId,
          athlete_id: parsedInput.athleteId,
          business_id: parsedInput.businessId,
        },
      });

      return {
        success: true,
        data: workoutAssignment,
      };
    } catch (error) {
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
