"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import type { ActionResponse } from "../../types/action-response";
import { appErrors } from "../../types/errors";
import { prisma } from "@/lib/db";

const schema = z.object({
  user_id: z.string(),
});

export const checkBusiness = createSafeActionClient()
  .schema(schema)
  .action(async ({ parsedInput }): Promise<ActionResponse> => {
    try {
      const business = await prisma.business.findFirst({
        where: {
          user_id: parsedInput.user_id,
        },
      });

      return {
        success: true,
        data: {
          exists: !!business,
        },
      };
    } catch (error) {
      console.error("Unexpected error in checkBusiness:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
