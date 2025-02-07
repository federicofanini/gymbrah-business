"use server";

import { createSafeActionClient } from "next-safe-action";
import { prisma } from "@/lib/db";
import type { ActionResponse } from "../types/action-response";
import { getBusinessId } from "../business/business-id";
import { appErrors } from "../types/errors";

interface Exercise {
  id: string;
  name: string;
}

interface WorkoutExercise {
  exercise: Exercise;
}

interface Workout {
  id: string;
  name: string;
  exercises: {
    exercise: Exercise;
  }[];
}

interface WorkoutAthlete {
  id: string;
  athlete_id: string;
  workout: Workout;
}

interface AssignedWorkout {
  id: string;
  athlete_id: string;
  workout: {
    id: string;
    name: string;
    exercises: WorkoutExercise[];
  };
}

export const getAssignedWorkouts = createSafeActionClient().action(
  async (): Promise<ActionResponse> => {
    try {
      const businessIdResponse = await getBusinessId();

      if (!businessIdResponse?.data?.success) {
        return {
          success: false,
          error: appErrors.UNEXPECTED_ERROR,
        };
      }

      const query = {
        where: {
          business_id: businessIdResponse.data.data,
        },
        include: {
          athlete: {
            select: {
              id: true,
              full_name: true,
            },
          },
          workout: {
            select: {
              id: true,
              name: true,
              exercises: {
                select: {
                  exercise: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      };

      const assignedWorkouts = await prisma.workout_athlete.findMany(query);

      if (!assignedWorkouts) {
        return {
          success: false,
          error: "No assigned workouts found",
        };
      }

      return {
        success: true,
        data: assignedWorkouts.map(
          (assignment: WorkoutAthlete): AssignedWorkout => ({
            id: assignment.id,
            athlete_id: assignment.athlete_id,
            workout: {
              id: assignment.workout.id,
              name: assignment.workout.name,
              exercises: assignment.workout.exercises.map((ex) => ({
                exercise: {
                  id: ex.exercise.id,
                  name: ex.exercise.name,
                },
              })),
            },
          })
        ),
      };
    } catch (error) {
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  }
);
