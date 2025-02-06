"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import type { ActionResponse } from "../types/action-response";
import { appErrors } from "../types/errors";
import { prisma } from "@/lib/db";

const schema = z.object({
  businessId: z.string().optional(),
  athleteId: z.string().optional(),
});

export const getWorkout = createSafeActionClient()
  .schema(schema)
  .action(async ({ parsedInput }): Promise<ActionResponse> => {
    try {
      const workouts = await prisma.workout.findMany({
        where: {
          OR: [
            { business_id: parsedInput.businessId },
            { athlete_id: parsedInput.athleteId },
          ],
        },
        include: {
          exercises: {
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
                  instructions: true,
                },
              },
            },
          },
        },
      });

      return {
        success: true,
        data: workouts,
      };
    } catch (error) {
      console.error("Error fetching workouts:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
