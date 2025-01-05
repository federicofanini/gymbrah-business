"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import type { ActionResponse } from "./types/action-response";

const schema = z.object({
  height: z.string().transform((val) => parseFloat(val) || null),
  weight: z.string().transform((val) => parseFloat(val) || null),
  sleep: z.enum(["less-6", "6-7", "7-8", "more-8"]).nullable(),
  alcohol: z.enum(["none", "1-3", "4-7", "more"]).nullable(),
  sugarIntake: z.enum(["low", "moderate", "high"]).nullable(),
  isSmoker: z.boolean().nullable(),
});

export async function getHealthProfile(): Promise<ActionResponse> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const { data, error } = await supabase
      .from("health_profile")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export const updateHealthProfile = createSafeActionClient()
  .schema(schema)
  .action(async (input): Promise<ActionResponse> => {
    try {
      const supabase = await createClient();

      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        return {
          success: false,
          error: "Unauthorized",
        };
      }

      // Update or insert health profile
      const { data, error } = await supabase
        .from("health_profile")
        .upsert(
          {
            id: crypto.randomUUID(), // Add unique ID for new records
            user_id: user.id,
            height: input.parsedInput.height,
            weight: input.parsedInput.weight,
            sleep_hours: input.parsedInput.sleep,
            alcohol: input.parsedInput.alcohol,
            sugar_intake: input.parsedInput.sugarIntake,
            is_smoker: input.parsedInput.isSmoker,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id",
          }
        )
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  });
