"use server";

import { createSafeActionClient } from "next-safe-action";
import type { ActionResponse } from "@/actions/types/action-response";
import { prisma } from "@/lib/db";
import { appErrors } from "@/actions/types/errors";
import { createClient } from "@/utils/supabase/server";

export const getBusinessDetails = createSafeActionClient().action(
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
          name: true,
          address: true,
          city: true,
          province: true,
          zip: true,
          country: true,
          vat: true,
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
        data: business,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : appErrors.UNEXPECTED_ERROR,
      };
    }
  }
);
