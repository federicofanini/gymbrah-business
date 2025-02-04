"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { prisma } from "@/lib/db";
import type { ActionResponse } from "@/actions/types/action-response";
import { appErrors } from "@/actions/types/errors";

const schema = z.object({
  clientId: z.string(),
  businessId: z.string(),
});

export const addClientAthlete = createSafeActionClient()
  .schema(schema)
  .action(async ({ parsedInput }): Promise<ActionResponse> => {
    try {
      const clientAthlete = await prisma.client_athlete.create({
        data: {
          client_id: parsedInput.clientId,
          business_id: parsedInput.businessId,
        },
      });

      return {
        success: true,
        data: clientAthlete,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? appErrors.UNEXPECTED_ERROR
            : appErrors.UNEXPECTED_ERROR,
      };
    }
  });
