"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import type { ActionResponse } from "@/actions/types/action-response";
import { EXERCISE_API_CONFIG, BODY_PARTS, type BodyPart } from "../api/config";

const exerciseParamsSchema = z.object({
  bodyPart: z
    .string()
    .refine((val) => Object.values(BODY_PARTS).includes(val as BodyPart), {
      message: "Invalid body part",
    }),
  limit: z.number().optional().default(10),
  offset: z.number().optional().default(0),
});

export const getExercises = createSafeActionClient()
  .schema(exerciseParamsSchema)
  .action(async ({ parsedInput }): Promise<ActionResponse> => {
    try {
      const { bodyPart, limit, offset } = parsedInput;
      const url = new URL(
        `/exercises/bodyPart/${bodyPart}`,
        EXERCISE_API_CONFIG.baseUrl
      );

      const response = await fetch(url, {
        headers: EXERCISE_API_CONFIG.headers,
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const allExercises = await response.json();
      const paginatedExercises = allExercises.slice(offset, offset + limit);

      return {
        success: true,
        data: paginatedExercises,
      };
    } catch (error) {
      console.error("Error fetching exercises:", error);
      return {
        success: false,
        error: "Failed to fetch exercises",
      };
    }
  });
