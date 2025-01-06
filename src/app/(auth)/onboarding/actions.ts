"use server";

import { createClient } from "@/utils/supabase/server";
import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import type { ActionResponse } from "@/actions/types/action-response";

const createProfileSchema = z.object({
  fullName: z.string().min(1),
});

export const createUserProfile = createSafeActionClient()
  .schema(createProfileSchema)
  .action(async ({ parsedInput }): Promise<ActionResponse> => {
    try {
      const { fullName } = parsedInput;
      const supabase = await createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        return { success: false, error: "No authenticated user found" };
      }

      // First check if user exists
      const { data: existingUser, error: fetchError } = await supabase
        .from("user")
        .select()
        .eq("id", user.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116 means no rows returned
        return { success: false, error: fetchError.message };
      }

      let profile;
      let updateError;

      const now = new Date().toISOString();

      if (existingUser) {
        // Update existing user
        const { data, error } = await supabase
          .from("user")
          .update({
            full_name: fullName,
            updated_at: now,
            created_at: existingUser.created_at,
          })
          .eq("id", user.id)
          .select()
          .single();
        profile = data;
        updateError = error;
      } else {
        // Insert new user
        const { data, error } = await supabase
          .from("user")
          .insert([
            {
              id: user.id,
              email: user.email,
              full_name: fullName,
              created_at: now,
              updated_at: now,
            },
          ])
          .select()
          .single();
        profile = data;
        updateError = error;
      }

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      return { success: true, data: profile };
    } catch (error) {
      return { success: false, error: "Unexpected error occurred" };
    }
  });

export async function getUserFullName() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error("Not authenticated");
    }

    const { data, error } = await supabase
      .from("user")
      .select("full_name")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }

    return data?.full_name || null;
  } catch (error) {
    console.error("Error getting user full name:", error);
    return null;
  }
}
