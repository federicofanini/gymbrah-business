"use server";

import { createSafeActionClient } from "next-safe-action";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import type { ActionResponse } from "../types/action-response";
import { prisma } from "@/lib/db";

export const signOut = createSafeActionClient().action(
  async (): Promise<ActionResponse> => {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
      redirect("/");
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: "Failed to sign out",
      };
    }
  }
);

export const getUser = createSafeActionClient().action(
  async (): Promise<ActionResponse> => {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return {
          success: false,
          error: "User not found",
        };
      }

      const userData = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          email: true,
          full_name: true,
          avatar_url: true,
        },
      });

      if (!userData) {
        return {
          success: false,
          error: "User data not found",
        };
      }

      return {
        success: true,
        data: userData,
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to fetch user data",
      };
    }
  }
);
