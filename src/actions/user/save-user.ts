"use server";

import { createSafeActionClient } from "next-safe-action";
import { prisma } from "@/lib/db";
import type { ActionResponse } from "../types/action-response";
import { createClient } from "@/utils/supabase/server";
import { appErrors } from "../types/errors";

// No schema needed since we're getting data from Supabase auth
export const saveUser = createSafeActionClient().action(
  async (): Promise<ActionResponse> => {
    try {
      const supabase = await createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        return {
          success: false,
          error: appErrors.UNAUTHORIZED,
        };
      }

      const dbUser = await prisma.user.upsert({
        where: {
          id: user.id,
        },
        update: {
          full_name: user.user_metadata.full_name,
          email: user.email ?? "",
          avatar_url: user.user_metadata.avatar_url,
        },
        create: {
          id: user.id,
          email: user.email ?? "",
          full_name: user.user_metadata.full_name,
          avatar_url: user.user_metadata.avatar_url,
        },
      });

      return {
        success: true,
        data: dbUser,
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
