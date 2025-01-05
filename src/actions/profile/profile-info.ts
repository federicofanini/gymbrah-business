"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import type { ActionResponse } from "../types/action-response";
import { createClient } from "@/utils/supabase/server";
import { appErrors } from "../types/errors";

const profileInfoSchema = z.object({
  full_name: z.string().min(1),
  bio: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  contactEmail: z.string().email().optional().or(z.literal("")),
  twitter: z.string().optional().or(z.literal("")),
  linkedin: z.string().optional().or(z.literal("")),
  github: z.string().optional().or(z.literal("")),
  instagram: z.string().optional().or(z.literal("")),
  youtube: z.string().optional().or(z.literal("")),
  tiktok: z.string().optional().or(z.literal("")),
  discord: z.string().optional().or(z.literal("")),
  telegram: z.string().optional().or(z.literal("")),
  bsky: z.string().optional().or(z.literal("")),
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_-]+$/),
});

export const getUserInfo = createSafeActionClient().action(
  async (): Promise<ActionResponse> => {
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

      const { data, error } = await supabase
        .from("user")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Database error:", error);
        return {
          success: false,
          error: appErrors.DATABASE_ERROR,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("Unexpected error:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  }
);

export const checkUsernameAvailability = createSafeActionClient()
  .schema(z.object({ username: z.string() }))
  .action(
    async ({
      parsedInput,
    }): Promise<ActionResponse<{ available: boolean }>> => {
      try {
        const supabase = await createClient();
        const { data, error } = await supabase
          .from("user")
          .select("username")
          .eq("username", parsedInput.username)
          .single();

        if (error && error.code === "PGRST116") {
          // No match found - username is available
          return {
            success: true,
            data: { available: true },
          };
        }

        return {
          success: true,
          data: { available: false },
        };
      } catch (error) {
        console.error("Username availability check error:", error);
        return {
          success: false,
          error: appErrors.UNEXPECTED_ERROR,
        };
      }
    }
  );

export const updateProfileInfo = createSafeActionClient()
  .schema(profileInfoSchema)
  .action(async ({ parsedInput }): Promise<ActionResponse> => {
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

      // Check username availability before update if username is changed
      const { data: existingUser } = await supabase
        .from("user")
        .select("username")
        .eq("username", parsedInput.username)
        .neq("id", user.id)
        .single();

      if (existingUser) {
        console.error("Username taken:", parsedInput.username);
        return {
          success: false,
          error: "Username is already taken",
        };
      }

      // Update profile information in the database
      const { error: updateError } = await supabase
        .from("user")
        .update({
          full_name: parsedInput.full_name || "",
          bio: parsedInput.bio || "",
          location: parsedInput.location || "",
          website: parsedInput.website || "",
          contactEmail: parsedInput.contactEmail || "",
          twitter: parsedInput.twitter || "",
          linkedin: parsedInput.linkedin || "",
          github: parsedInput.github || "",
          instagram: parsedInput.instagram || "",
          youtube: parsedInput.youtube || "",
          tiktok: parsedInput.tiktok || "",
          discord: parsedInput.discord || "",
          telegram: parsedInput.telegram || "",
          bsky: parsedInput.bsky || "",
          username: parsedInput.username,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) {
        console.error("Database update error:", updateError);
        return {
          success: false,
          error: appErrors.DATABASE_ERROR,
        };
      }

      return {
        success: true,
        data: { message: "Profile updated successfully" },
      };
    } catch (error) {
      console.error("Profile update error:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
