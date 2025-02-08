"use server";

import { createSafeActionClient } from "next-safe-action";
import { prisma } from "@/lib/db";
import type { ActionResponse } from "../types/action-response";
import { getBusinessId } from "../business/business-id";
import { appErrors } from "../types/errors";
import { z } from "zod";

export interface Exercise {
  id: string;
  name: string;
  body_part: string;
  equipment: string;
  target: string;
  gif_url: string;
  secondary_muscles: string[];
  instructions: string[];
}

export interface WorkoutExercise {
  id: string;
  exercise: Exercise;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
  round?: string;
}

export interface Workout {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
}

export interface AssignedWorkout {
  id: string;
  athlete_id: string;
  workout: Workout;
}

export const getAssignedWorkouts = createSafeActionClient()
  .schema(
    z.object({
      athleteId: z.string(),
    })
  )
  .action(async ({ parsedInput }): Promise<ActionResponse> => {
    try {
      const businessIdResponse = await getBusinessId();

      if (!businessIdResponse?.data?.success) {
        return {
          success: false,
          error: appErrors.UNEXPECTED_ERROR,
        };
      }

      // Get workout_athlete records for this athlete and business
      const workoutAthletes = await prisma.workout_athlete.findMany({
        where: {
          business_id: businessIdResponse.data.data,
          athlete_id: parsedInput.athleteId,
        },
      });

      // Get the full workout details for each assigned workout
      const workouts = await prisma.workout.findMany({
        where: {
          id: {
            in: workoutAthletes.map((wa) => wa.workout_id),
          },
          business_id: businessIdResponse.data.data,
        },
        include: {
          exercises: {
            include: {
              exercise: true,
            },
          },
        },
      });

      if (!workouts) {
        return {
          success: false,
          error: "No workouts found",
        };
      }

      const formattedWorkouts = workouts.map((workout): AssignedWorkout => {
        // Find the corresponding workout_athlete record
        const workoutAthlete = workoutAthletes.find(
          (wa) => wa.workout_id === workout.id
        );

        return {
          id: workout.id,
          athlete_id: workoutAthlete?.athlete_id || "",
          workout: {
            id: workout.id,
            name: workout.name,
            exercises: workout.exercises.map((ex) => ({
              id: ex.id,
              exercise: {
                id: ex.exercise.id,
                name: ex.exercise.name || "",
                body_part: ex.exercise.body_part || "",
                equipment: ex.exercise.equipment || "",
                target: ex.exercise.target || "",
                gif_url: ex.exercise.gif_url || "",
                secondary_muscles: ex.exercise.secondary_muscles || [],
                instructions: ex.exercise.instructions || [],
              },
              sets: ex.sets || 0,
              reps: ex.reps || 0,
              weight: ex.weight || 0,
              duration: ex.duration || 0,
              round: ex.round || "1",
            })),
          },
        };
      });

      return {
        success: true,
        data: formattedWorkouts,
      };
    } catch (error) {
      console.error("Error fetching assigned workouts:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });

export const deleteAssignedWorkout = createSafeActionClient()
  .schema(
    z.object({
      workoutId: z.string(),
      athleteId: z.string(),
    })
  )
  .action(async ({ parsedInput }): Promise<ActionResponse> => {
    try {
      await prisma.workout_athlete.deleteMany({
        where: {
          workout_id: parsedInput.workoutId,
          athlete_id: parsedInput.athleteId,
        },
      });

      return {
        success: true,
        data: null,
      };
    } catch (error) {
      console.error("Error deleting assigned workout:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
