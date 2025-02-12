"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import type { ActionResponse } from "../types/action-response";
import { prisma } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";

const schema = z.object({
  email: z.string().email(),
  full_name: z.string(),
  avatar_url: z.string().optional(),
});

export const saveUser = createSafeActionClient()
  .schema(schema)
  .action(async (input): Promise<ActionResponse> => {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return {
          success: false,
          error: "User not authenticated",
        };
      }

      // Get athlete data
      const athlete = await prisma.athlete.findFirst({
        where: {
          user_id: user.id,
        },
      });

      if (!athlete) {
        return {
          success: false,
          error: "Athlete not found",
        };
      }

      // Create or update user
      const savedUser = await prisma.user.upsert({
        where: {
          id: user.id,
        },
        create: {
          id: user.id,
          email: input.parsedInput.email,
          full_name: athlete.name + " " + athlete.surname,
          avatar_url: input.parsedInput.avatar_url,
          paid: false,
          role: "athlete",
        },
        update: {
          email: input.parsedInput.email,
          full_name: athlete.name + " " + athlete.surname,
          avatar_url: input.parsedInput.avatar_url,
          role: "athlete",
        },
      });

      return {
        success: true,
        data: savedUser,
      };
    } catch (error) {
      console.error("Error saving user:", error);
      return {
        success: false,
        error: "Failed to save user",
      };
    }
  });
