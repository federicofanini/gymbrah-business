import "server-only";

import { unstable_cache } from "next/cache";
import { cache } from "react";
import { createClient } from "@/utils/supabase/server";
import { getFeedbacks } from "./feedback";
import type { ActionResponse } from "../types/action-response";

// Cache per request and revalidate every 30 minutes
export const getCachedFeedbacks = cache(async (): Promise<ActionResponse> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  return unstable_cache(
    async () => {
      return getFeedbacks(supabase);
    },
    ["feedbacks", user.id],
    {
      tags: [`feedbacks_${user.id}`],
      // 30 minutes, jwt expires in 1 hour
      revalidate: 1800,
    }
  )();
});
