"use server";

import { createSafeActionClient } from "next-safe-action";
import { prisma } from "@/lib/db";
import { appErrors } from "@/actions/types/errors";
import type { ActionResponse } from "@/actions/types/action-response";
import { createClient } from "@/utils/supabase/server";
import { getBusinessId } from "../business-id";

export const getBusinessCode = createSafeActionClient().action(
  async (): Promise<ActionResponse> => {
    try {
      const businessIdResponse = await getBusinessId();

      if (!businessIdResponse?.data?.success) {
        return {
          success: false,
          error: businessIdResponse?.data?.error,
        };
      }

      const businessId = businessIdResponse?.data?.data;

      // Get the business code
      const businessCode = await prisma.business_code.findFirst({
        where: {
          business_id: businessId,
        },
        select: {
          code: true,
        },
      });

      if (!businessCode) {
        return {
          success: false,
          error: appErrors.NOT_FOUND,
        };
      }

      return {
        success: true,
        data: businessCode,
      };
    } catch (error) {
      console.error("Error in getBusinessCode:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  }
);
