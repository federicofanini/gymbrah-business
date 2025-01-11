"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { prisma } from "@/lib/db";
import type { ActionResponse } from "../types/action-response";

const WORKOUT_POINTS = 100;

const schema = z.object({
  userId: z.string(),
});

export const awardWorkoutPoints = createSafeActionClient()
  .schema(schema)
  .action(async ({ parsedInput }): Promise<ActionResponse> => {
    try {
      const { userId } = parsedInput;
      // Get or create gamification record
      let gamification = await prisma.gamification.findUnique({
        where: { user_id: userId },
      });

      if (!gamification) {
        gamification = await prisma.gamification.create({
          data: {
            user_id: userId,
            points: WORKOUT_POINTS,
            level: 1,
            streak_days: 1,
            workouts_completed: 1,
          },
        });
      }

      // Calculate streak
      const lastWorkoutDate = gamification.last_workout_date;
      const today = new Date();
      const isStreak =
        lastWorkoutDate &&
        Math.abs(today.getTime() - lastWorkoutDate.getTime()) <
          24 * 60 * 60 * 1000;

      // Update gamification
      const updatedGamification = await prisma.gamification.update({
        where: { user_id: userId },
        data: {
          points: gamification.points + WORKOUT_POINTS, // Base points for workout
          workouts_completed: gamification.workouts_completed + 1,
          streak_days: isStreak ? gamification.streak_days + 1 : 1,
          longest_streak: isStreak
            ? Math.max(
                gamification.longest_streak,
                gamification.streak_days + 1
              )
            : gamification.longest_streak,
          last_workout_date: today,
          level: Math.floor((gamification.points + WORKOUT_POINTS) / 1000) + 1, // Level up every 1000 points
        },
      });

      return {
        success: true,
        data: updatedGamification,
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to award workout points",
      };
    }
  });
