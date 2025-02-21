"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { prisma } from "@/lib/db";
import type { ActionResponse } from "../types/action-response";
import { appErrors } from "../types/errors";
import { createClient } from "@/utils/supabase/server";

const schema = z.object({
  feedbackId: z.string().min(1),
});

export const upvoteFeedback = createSafeActionClient()
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

      const feedback = await prisma.feedback.update({
        where: {
          id: input.parsedInput.feedbackId,
        },
        data: {
          upvotes: {
            increment: 1,
          },
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

export const downvoteFeedback = createSafeActionClient()
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

      const feedback = await prisma.feedback.update({
        where: {
          id: input.parsedInput.feedbackId,
        },
        data: {
          upvotes: {
            decrement: 1,
          },
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
