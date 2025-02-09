"use server";

import { createSafeActionClient } from "next-safe-action";
import { prisma } from "@/lib/db";
import { appErrors } from "@/actions/types/errors";
import type { ActionResponse } from "@/actions/types/action-response";
import { createClient } from "@/utils/supabase/server";

export const getAthleteCode = createSafeActionClient().action(
  async (): Promise<ActionResponse> => {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return {
          success: false,
          error: appErrors.UNAUTHORIZED,
        };
      }

      // Get the athlete code
      const athleteCode = await prisma.athlete.findFirst({
        where: {
          user_id: user.id,
        },
        select: {
          athlete_code: true,
        },
      });

      if (!athleteCode) {
        return {
          success: false,
          error: appErrors.NOT_FOUND,
        };
      }

      return {
        success: true,
        data: athleteCode,
      };
    } catch (error) {
      console.error("Error in getAthleteCode:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  }
);
