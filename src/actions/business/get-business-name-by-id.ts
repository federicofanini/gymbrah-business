"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import type { ActionResponse } from "@/actions/types/action-response";
import { prisma } from "@/lib/db";
import { appErrors } from "@/actions/types/errors";

const schema = z.object({
  businessId: z.string(),
});

export const getBusinessNameById = createSafeActionClient()
  .schema(schema)
  .action(async ({ parsedInput }): Promise<ActionResponse> => {
    try {
      const business = await prisma.business.findFirst({
        where: {
          id: parsedInput.businessId,
        },
        select: {
          name: true,
        },
      });

      if (!business) {
        return {
          success: false,
          error: appErrors.NOT_FOUND,
        };
      }

      return {
        success: true,
        data: business.name,
      };
    } catch (error) {
      console.error("Error fetching business name:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
