"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import type { ActionResponse } from "../../types/action-response";
import { appErrors } from "../../types/errors";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { generateCode } from "@/lib/user-code";

const schema = z.object({
  name: z.string().min(2).max(100),
  address: z.string().min(5).max(200),
  city: z.string().min(2).max(100),
  province: z.string().min(2).max(100),
  zip: z.string().min(4).max(10),
  country: z.string().min(2).max(100),
  vat: z.string().min(5).max(30),
});

export const addBusiness = createSafeActionClient()
  .schema(schema)
  .action(async (input): Promise<ActionResponse> => {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("Auth error:", authError);
        return {
          success: false,
          error: appErrors.UNAUTHORIZED,
        };
      }

      // Create business and business code in a transaction
      const result = await prisma.$transaction(async (tx) => {
        const business = await tx.business.create({
          data: {
            id: crypto.randomUUID(),
            user_id: user.id,
            name: input.parsedInput.name,
            address: input.parsedInput.address,
            city: input.parsedInput.city,
            province: input.parsedInput.province,
            zip: input.parsedInput.zip,
            country: input.parsedInput.country,
            vat: input.parsedInput.vat,
            created_at: new Date(),
            updated_at: new Date(),
          },
        });

        // Generate and create business code
        const businessCode = await tx.business_code.create({
          data: {
            id: crypto.randomUUID(),
            code: generateCode(),
            business_id: business.id,
            created_at: new Date(),
            updated_at: new Date(),
          },
        });

        return { business, businessCode };
      });

      // Revalidate the business page
      revalidatePath("/business");

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Unexpected error in addBusiness:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
