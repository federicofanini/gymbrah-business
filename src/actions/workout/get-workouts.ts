"use server";

import { createClient } from "@/utils/supabase/server";
import type { ActionResponse } from "../types/action-response";
import { appErrors } from "../types/errors";
import { prisma } from "@/lib/db";

export async function getWorkouts(): Promise<ActionResponse> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: appErrors.UNAUTHORIZED,
      };
    }

    const workouts = await prisma.workout.findMany({
      where: {
        user_id: user.id,
      },
      select: {
        id: true,
        name: true,
        selected: true,
        created_at: true,
        exercises: {
          select: {
            id: true,
            sets: true,
            reps: true,
            weight: true,
            duration: true,
            exercise: {
              select: {
                id: true,
                name: true,
                category: true,
                muscles: true,
                outcomes: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const formattedWorkouts = workouts.map((workout) => ({
      id: workout.id,
      name: workout.name,
      selected: workout.selected,
      created_at: workout.created_at,
      exercises: workout.exercises.map((exercise) => ({
        id: exercise.id,
        name: exercise.exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight,
        duration: exercise.duration,
        category: exercise.exercise.category,
        muscles: exercise.exercise.muscles,
        outcomes: exercise.exercise.outcomes,
        exercise_id: exercise.exercise.id,
        workout_id: workout.id,
      })),
    }));

    return {
      success: true,
      data: formattedWorkouts,
    };
  } catch (error) {
    return {
      success: false,
      error: appErrors.UNEXPECTED_ERROR,
    };
  }
}
