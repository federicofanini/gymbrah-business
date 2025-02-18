"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import type { ActionResponse } from "@/actions/types/action-response";
import { prisma } from "@/lib/db";
import { appErrors } from "@/actions/types/errors";
import { createClient } from "@/utils/supabase/server";

const schema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  province: z.string().min(1),
  zip: z.string().min(1),
  country: z.string().min(1),
  vat: z.string().min(1),
});

export const updateBusinessDetails = createSafeActionClient()
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

      // First find the business
      const existingBusiness = await prisma.business.findFirst({
        where: {
          user_id: user.id,
        },
      });

      if (!existingBusiness) {
        return {
          success: false,
          error: appErrors.NOT_FOUND,
        };
      }

      // Then update using the found business id
      const business = await prisma.business.update({
        where: {
          id: existingBusiness.id,
        },
        data: {
          name: input.parsedInput.name,
          address: input.parsedInput.address,
          city: input.parsedInput.city,
          province: input.parsedInput.province,
          zip: input.parsedInput.zip,
          country: input.parsedInput.country,
          vat: input.parsedInput.vat,
        },
      });

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
  });
