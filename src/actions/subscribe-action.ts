"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import type { ActionResponse } from "@/actions/types/action-response";
import { appErrors } from "@/actions/types/errors";
import { prisma } from "@/lib/db";

const schema = z.object({
  email: z.string().email(),
});

export const subscribeAction = createSafeActionClient()
  .schema(schema)
  .action(async (input): Promise<ActionResponse> => {
    try {
      const waitlistEntry = await prisma.waitlist.create({
        data: {
          id: crypto.randomUUID(),
          email: input.parsedInput.email,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      revalidatePath("/");

      return {
        success: true,
        data: waitlistEntry,
      };
    } catch (error) {
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
