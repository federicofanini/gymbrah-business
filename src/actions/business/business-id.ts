"use server";

import { createSafeActionClient } from "next-safe-action";
import { prisma } from "@/lib/db";
import type { ActionResponse } from "../types/action-response";
import { createClient } from "@/utils/supabase/server";
import { appErrors } from "../types/errors";

export const getBusinessId = createSafeActionClient().action(
  async (): Promise<ActionResponse> => {
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

      const business = await prisma.business.findFirst({
        where: {
          user_id: user.id,
        },
        select: {
          id: true,
        },
      });

      if (!business) {
        return {
          success: false,
          error: "Business not found",
        };
      }

      return {
        success: true,
        data: business.id,
      };
    } catch (error) {
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  }
);
