import "server-only";

import { unstable_cache } from "next/cache";
import { cache } from "react";
import { createClient } from "@/utils/supabase/server";
import { getExercises } from "./get-exercises";
import type { ActionResponse } from "../types/action-response";
import { appErrors } from "../types/errors";

export const getCachedExercises = cache(async (): Promise<ActionResponse> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: appErrors.UNAUTHORIZED,
    };
  }

  return unstable_cache(
    async () => {
      return getExercises(supabase);
    },
    // Use a single global key for all exercises
    ["exercises"],
    {
      // Use a single global tag for all exercises
      tags: ["exercises"],
      // 30 minutes, jwt expires in 1 hour
      revalidate: 1800,
    }
  )();
});
