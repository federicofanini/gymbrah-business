"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import type { ActionResponse } from "../../types/action-response";
import { appErrors } from "../../types/errors";
import { prisma } from "@/lib/db";

const schema = z.object({
  user_id: z.string(),
});

export const checkPlan = createSafeActionClient()
  .schema(schema)
  .action(async ({ parsedInput }): Promise<ActionResponse> => {
    try {
      const plan = await prisma.plan.findFirst({
        where: {
          user_id: parsedInput.user_id,
        },
        select: {
          subscription_status: true,
        },
      });

      return {
        success: true,
        data: {
          hasActiveSubscription: !!plan?.subscription_status,
        },
      };
    } catch (error) {
      console.error("Unexpected error in checkPlan:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
