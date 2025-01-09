"use server";

import { Client } from "@/utils/supabase/type";
import type { ActionResponse } from "../types/action-response";
import { appErrors } from "../types/errors";
import { prisma } from "@/lib/db";

export async function getExercises(supabase: Client): Promise<ActionResponse> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: appErrors.UNAUTHORIZED,
    };
  }

  const exercises = await prisma.exercises.findMany({
    select: {
      id: true,
      name: true,
      category: true,
      muscles: true,
      outcomes: true,
      created_at: true,
      updated_at: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return {
    success: true,
    data: exercises,
  };
}
