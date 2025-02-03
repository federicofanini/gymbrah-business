"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import type { ActionResponse } from "../../types/action-response";
import { appErrors } from "../../types/errors";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

const schema = z.object({
  stripeCustomerId: z.string(),
  stripeSubscriptionId: z.string(),
  stripePriceId: z.string(),
  planName: z.string(),
});

export const addBusinessPlan = createSafeActionClient()
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

      const plan = await prisma.plan.create({
        data: {
          id: crypto.randomUUID(),
          user_id: user.id,
          stripe_customer_id: input.parsedInput.stripeCustomerId,
          stripe_subscription_id: input.parsedInput.stripeSubscriptionId,
          stripe_price_id: input.parsedInput.stripePriceId,
          plan_name: input.parsedInput.planName,
          subscription_status: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      // Revalidate the business page
      revalidatePath("/business");

      return {
        success: true,
        data: plan,
      };
    } catch (error) {
      console.error("Unexpected error in addBusinessPlan:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
