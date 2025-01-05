"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { prisma } from "@/lib/db";
import type { ActionResponse } from "../types/action-response";

// Define the exercise input schema
const exerciseSchema = z.object({
  name: z.string(),
  reps: z.number().int().positive(),
  sets: z.number().int().positive(),
  weight: z.number().optional(), // Optional for bodyweight exercises
});

// Schema for creating a complete workout
const createWorkoutSchema = z.object({
  userId: z.string(),
  exercises: z.array(exerciseSchema),
});

// Schema for selecting/deleting a workout
const workoutIdSchema = z.object({
  workoutId: z.string(),
});

export const createWorkout = createSafeActionClient()
  .schema(createWorkoutSchema)
  .action(async (input): Promise<ActionResponse> => {
    try {
      // Create workout
      const workout = await prisma.workout.create({
        data: {
          user_id: input.parsedInput.userId,
          exercises: {
            create: input.parsedInput.exercises.map((exercise) => ({
              name: exercise.name,
              reps: exercise.reps,
              sets: exercise.sets,
              weight: exercise.weight,
            })),
          },
        },
        include: {
          exercises: true,
        },
      });

      return {
        success: true,
        data: workout,
      };
    } catch (error) {
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  });

export const selectWorkout = createSafeActionClient()
  .schema(workoutIdSchema)
  .action(async (input): Promise<ActionResponse> => {
    try {
      // First, unselect any currently selected workout
      await prisma.workout.updateMany({
        where: {
          selected: true,
        },
        data: {
          selected: false,
        },
      });

      // Then select the specified workout
      const workout = await prisma.workout.update({
        where: {
          id: input.parsedInput.workoutId,
        },
        data: {
          selected: true,
        },
        include: {
          exercises: true,
        },
      });

      return {
        success: true,
        data: workout,
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to select workout",
      };
    }
  });

export const deleteWorkout = createSafeActionClient()
  .schema(workoutIdSchema)
  .action(async (input): Promise<ActionResponse> => {
    try {
      const workout = await prisma.workout.delete({
        where: {
          id: input.parsedInput.workoutId,
        },
      });

      return {
        success: true,
        data: workout,
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to delete workout",
      };
    }
  });
