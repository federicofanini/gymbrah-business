import "server-only";

import { unstable_cache } from "next/cache";
import { cache } from "react";
import { createClient } from "@/utils/supabase/server";
import { getExercises } from "./get-exercises";
import { getSelectedWorkout } from "./get-workouts";
import type { ActionResponse } from "../types/action-response";
import { appErrors } from "../types/errors";
import { prisma } from "@/lib/db";

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
    ["exercises"],
    {
      tags: ["exercises"],
      revalidate: 21600, // 6 hours
    }
  )();
});

export const getCachedSelectedWorkout = cache(
  async (): Promise<ActionResponse> => {
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
        return getSelectedWorkout(supabase);
      },
      // Cache key includes user ID for per-user caching
      [`selected-workout-${user.id}`],
      {
        // Tag includes user ID for targeted revalidation
        tags: [`selected-workout-${user.id}`],
        // 5 minutes since workout selection can change frequently
        revalidate: 300,
      }
    )();
  }
);

export const getCachedWorkoutFrequency = cache(
  async (): Promise<ActionResponse> => {
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
        try {
          const frequency = await prisma.workout_frequency.findUnique({
            where: {
              user_id: user.id,
            },
            select: {
              frequency: true,
            },
          });

          return {
            success: true,
            data: frequency,
          };
        } catch (error) {
          return {
            success: false,
            error: appErrors.UNEXPECTED_ERROR,
          };
        }
      },
      [`workout-frequency-${user.id}`],
      {
        tags: [`workout-frequency-${user.id}`],
        revalidate: 300, // 5 minutes
      }
    )();
  }
);

export const getCachedWorkoutsByDay = cache(
  async (): Promise<ActionResponse> => {
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
        try {
          const workouts = await prisma.workout.findMany({
            where: {
              user_id: user.id,
              selected: true,
            },
            select: {
              id: true,
              name: true,
              selected: true,
              created_at: true,
              frequency: true,
              exercises: {
                select: {
                  id: true,
                  sets: true,
                  reps: true,
                  weight: true,
                  round: true,
                  duration: true,
                  exercise: {
                    select: {
                      id: true,
                      name: true,
                      body_part: true,
                      equipment: true,
                      target: true,
                      secondary_muscles: true,
                      instructions: true,
                      gif_url: true,
                    },
                  },
                },
              },
            },
          });

          const workoutsByDay: Record<string, any> = {
            "1": null,
            "2": null,
            "3": null,
            "4": null,
            "5": null,
            "6": null,
            "7": null,
          };

          workouts.forEach((workout) => {
            const days = workout.frequency?.split(",") || [];
            const formattedWorkout = {
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
                round: exercise.round,
                body_part: exercise.exercise.body_part,
                equipment: exercise.exercise.equipment,
                gif_url: exercise.exercise.gif_url,
                target: exercise.exercise.target,
                secondary_muscles: exercise.exercise.secondary_muscles,
                instructions: exercise.exercise.instructions,
                exercise_id: exercise.exercise.id,
                workout_id: workout.id,
              })),
            };

            days.forEach((day) => {
              workoutsByDay[day] = formattedWorkout;
            });
          });

          return {
            success: true,
            data: workoutsByDay,
          };
        } catch (error) {
          return {
            success: false,
            error: appErrors.UNEXPECTED_ERROR,
          };
        }
      },
      [`workouts-by-day-${user.id}`],
      {
        tags: [`workouts-by-day-${user.id}`],
        revalidate: 300, // 5 minutes
      }
    )();
  }
);
