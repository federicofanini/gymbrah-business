"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { prisma } from "@/lib/db";
import type { ActionResponse } from "../types/action-response";
import { appErrors } from "../types/errors";
import { createClient } from "@/utils/supabase/server";

const schema = z.object({
  status: z.enum(["in-review", "scheduled", "completed"]).optional(),
});

export const getFeedbacks = createSafeActionClient()
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

      const feedbacks = await prisma.feedback.findMany({
        where: input.parsedInput.status
          ? {
              status: input.parsedInput.status,
            }
          : undefined,
        orderBy: [
          {
            status: "asc",
          },
          {
            upvotes: "desc",
          },
          {
            created_at: "desc",
          },
        ],
        include: {
          user: {
            select: {
              full_name: true,
              avatar_url: true,
            },
          },
        },
        cacheStrategy: { ttl: 300, swr: 60 },
      });

      return {
        success: true,
        data: feedbacks,
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
