"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import type { ActionResponse } from "../../types/action-response";
import { appErrors } from "../../types/errors";
import { prisma } from "@/lib/db";

const schema = z.object({
  user_id: z.string(),
});

export const checkAthlete = createSafeActionClient()
  .schema(schema)
  .action(async ({ parsedInput }): Promise<ActionResponse> => {
    try {
      const athlete = await prisma.athlete.findFirst({
        where: {
          user_id: parsedInput.user_id,
        },
        select: {
          id: true,
        },
      });

      return {
        success: true,
        data: {
          exists: !!athlete,
          id: athlete?.id,
        },
      };
    } catch (error) {
      console.error("Unexpected error in checkAthlete:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
