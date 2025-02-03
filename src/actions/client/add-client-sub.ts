"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import type { ActionResponse } from "../types/action-response";
import { appErrors } from "../types/errors";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

const schema = z.object({
  clientId: z.string().uuid(),
  subType: z.enum([
    "monthly",
    "bimestral",
    "trimestral",
    "quadrimestral",
    "semestral",
    "yearly",
  ]),
  paymentDate: z.string().transform((str) => new Date(str)),
  renewalDate: z.string().transform((str) => new Date(str)),
  monthsPaid: z.string(),
});

export const addClientSubscription = createSafeActionClient()
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

      // Get business ID for the current user
      const business = await prisma.business.findFirst({
        where: {
          user_id: user.id,
        },
      });

      if (!business) {
        return {
          success: false,
          error: appErrors.NOT_FOUND,
        };
      }

      // Verify client exists and belongs to this business
      const client = await prisma.client.findFirst({
        where: {
          id: input.parsedInput.clientId,
          business_id: business.id,
        },
      });

      if (!client) {
        return {
          success: false,
          error: appErrors.NOT_FOUND,
        };
      }

      const subscription = await prisma.business_client_subscription.create({
        data: {
          id: crypto.randomUUID(),
          client_id: input.parsedInput.clientId,
          business_id: business.id,
          sub_type: input.parsedInput.subType,
          payment_date: input.parsedInput.paymentDate,
          renewal_date: input.parsedInput.renewalDate,
          months_paid: input.parsedInput.monthsPaid,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      // Revalidate the subscriptions page
      revalidatePath("/business?tab=subscriptions");

      return {
        success: true,
        data: subscription,
      };
    } catch (error) {
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
