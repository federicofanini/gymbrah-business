"use server";

import { createSafeActionClient } from "next-safe-action";
import type { ActionResponse } from "./types";
import { createClient } from "@/utils/supabase/server";

export const getUserCount = createSafeActionClient().action(
  async (): Promise<ActionResponse> => {
    try {
      const supabase = await createClient();

      const { count, error } = await supabase
        .from("user")
        .select("id", { count: "exact", head: true });

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: count ?? 0,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to get user count",
      };
    }
  }
);
