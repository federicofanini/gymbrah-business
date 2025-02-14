"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { prisma } from "@/lib/db";
import type { ActionResponse } from "../types/action-response";
import { appErrors } from "../types/errors";
import { createClient } from "@/utils/supabase/server";
import { getRequiredXPForLevel } from "./rewards";

/**
 * Stores or updates gamification data for a user in the database.
 *
 * @description
 * This server action handles storing and updating gamification-related data for a user, including:
 * - Points and XP/level progression
 * - Streak tracking (current and longest)
 * - Workout and set completion counts
 * - Achievements and badges
 * - Last workout timestamp
 *
 * The action performs an upsert operation - it will update existing data if found,
 * or create a new record if none exists for the user.
 *
 * @param input - Object containing gamification data fields to store/update:
 * - points: Current point total
 * - level: Current user level
 * - workoutsCompleted: Total completed workouts
 * - totalSets: Total sets completed
 * - achievements: Array of achievement IDs
 * - badges: Array of badge IDs
 * - lastWorkoutDate: Timestamp of most recent workout
 * - currentXp: Current XP towards next level
 *
 * All input fields are optional to allow partial updates.
 *
 * @returns ActionResponse containing:
 * - On success: The stored/updated gamification data record
 * - On failure: An error object with the reason for failure
 */
const schema = z.object({
  points: z.number().optional(),
  level: z.number().optional(),
  workoutsCompleted: z.number().optional(),
  totalSets: z.number().optional(),
  achievements: z.array(z.string()).optional(),
  badges: z.array(z.string()).optional(),
  lastWorkoutDate: z.date().optional(),
  currentXp: z.number().optional(),
});

export const storeGamificationData = createSafeActionClient()
  .schema(schema)
  .action(async (input): Promise<ActionResponse> => {
    try {
      const supabase = await createClient();
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

      // Get existing user data to calculate streak and progression
      const existingData = await prisma.gamification.findUnique({
        where: { user_id: user.id },
      });

      const now = new Date();
      let streakDays = 1; // Default to 1 for first workout
      let longestStreak = existingData?.longest_streak || 1;

      if (existingData?.last_workout_date) {
        const lastWorkoutDate = existingData.last_workout_date;
        const daysSinceLastWorkout = Math.floor(
          (now.getTime() - lastWorkoutDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceLastWorkout === 1) {
          // Consecutive day workout
          streakDays = (existingData.streak_days || 0) + 1;
          longestStreak = Math.max(
            streakDays,
            existingData.longest_streak || 0
          );
        } else if (daysSinceLastWorkout > 1) {
          // Streak broken
          streakDays = 1;
        } else if (daysSinceLastWorkout === 0) {
          // Same day workout - maintain current streak
          streakDays = existingData.streak_days || 1;
        }
      }

      // Calculate new values, using input values directly as they represent the new totals
      const newPoints = input.parsedInput.points ?? existingData?.points ?? 0;
      const newWorkoutsCompleted =
        input.parsedInput.workoutsCompleted ??
        existingData?.workouts_completed ??
        0;
      const newTotalSets =
        input.parsedInput.totalSets ?? existingData?.total_sets ?? 0;
      const currentLevel = input.parsedInput.level ?? existingData?.level ?? 1;

      // Calculate XP and next level requirements
      const currentXp =
        input.parsedInput.currentXp ?? existingData?.current_xp ?? 0;
      const nextLevelXp = await getRequiredXPForLevel(currentLevel + 1);

      // Verify XP is within valid range for current level
      const validatedCurrentXp = Math.min(currentXp, nextLevelXp - 1);

      // Merge achievements and badges arrays
      const newAchievements = [
        ...new Set([
          ...(existingData?.achievements || []),
          ...(input.parsedInput.achievements || []),
        ]),
      ];

      const newBadges = [
        ...new Set([
          ...(existingData?.badges || []),
          ...(input.parsedInput.badges || []),
        ]),
      ];

      const data = await prisma.gamification.upsert({
        where: {
          user_id: user.id,
        },
        update: {
          points: newPoints,
          level: currentLevel,
          streak_days: streakDays,
          longest_streak: longestStreak,
          workouts_completed: newWorkoutsCompleted,
          total_sets: newTotalSets,
          achievements: newAchievements,
          badges: newBadges,
          last_workout_date: now,
          current_xp: validatedCurrentXp,
          next_level_xp: nextLevelXp,
          updated_at: now,
        },
        create: {
          user_id: user.id,
          points: newPoints,
          level: currentLevel,
          streak_days: streakDays,
          longest_streak: longestStreak,
          workouts_completed: newWorkoutsCompleted,
          total_sets: newTotalSets,
          achievements: newAchievements,
          badges: newBadges,
          last_workout_date: now,
          current_xp: validatedCurrentXp,
          next_level_xp: nextLevelXp,
          updated_at: now,
        },
      });

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("Error storing gamification data:", error);
      return {
        success: false,
        error: appErrors.DATABASE_ERROR,
      };
    }
  });
