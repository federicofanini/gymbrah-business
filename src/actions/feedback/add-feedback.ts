"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { prisma } from "@/lib/db";
import type { ActionResponse } from "../types/action-response";
import { appErrors } from "../types/errors";
import { createClient } from "@/utils/supabase/server";

const schema = z.object({
  message: z.string().min(1),
  rating: z.number().min(1).max(5),
  category: z.enum(["bug", "feature-request", "general", "other"]),
});

export const addFeedback = createSafeActionClient()
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

      const feedback = await prisma.feedback.create({
        data: {
          user_id: user.id,
          message: input.parsedInput.message,
          rating: input.parsedInput.rating,
          category: input.parsedInput.category,
          status: "in-review",
          upvotes: 0,
        },
      });

      return {
        success: true,
        data: feedback,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? appErrors.DATABASE_ERROR
            : appErrors.UNEXPECTED_ERROR,
      };
    }
  });
