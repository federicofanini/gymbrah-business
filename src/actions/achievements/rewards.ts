"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import type { ActionResponse } from "../types/action-response";
import { appErrors } from "../types/errors";
import { storeGamificationData } from "./assign-rewards";
import { getUserGamificationData } from "./get-user-data";
import { ACHIEVEMENTS } from "./thresholds";

const REWARD_POINTS = {
  WORKOUT_COMPLETION: 100,
  STREAK_BONUS: 50, // Additional points per day of streak
  SET_COMPLETION: 10,
  LEVEL_UP_BONUS: 200,
} as const;

// Experience points needed for each level
// Formula: baseXP * (level ^ 1.2)
const BASE_XP = 100;

/**
 * Calculates the required XP for a given level using the formula: baseXP * (level ^ 1.5)
 * @param level The level to calculate XP requirement for
 * @returns The amount of XP required to reach the given level
 */
export async function getRequiredXPForLevel(level: number): Promise<number> {
  return Math.floor(BASE_XP * Math.pow(level, 1.2));
}

const schema = z.object({
  workoutId: z.string(),
  completedSets: z.number(),
});

/**
 * Calculates and awards rewards for workout completion
 * Handles:
 * - Base points for workout completion
 * - Streak bonuses
 * - Achievement unlocks
 * - Level progression
 * - Badge awards
 */
export const calculateWorkoutRewards = createSafeActionClient()
  .schema(schema)
  .action(async (input): Promise<ActionResponse> => {
    try {
      // Get user's current gamification data
      const userData = await getUserGamificationData();

      // Initialize with historical points
      let newPoints = userData.currentPoints;
      let currentXp = userData.currentXP;
      let currentLevel = userData.currentLevel;
      let pointsGained = 0;
      const newAchievements: string[] = [];
      const newBadges: string[] = [];

      // Base workout completion points and XP
      pointsGained += REWARD_POINTS.WORKOUT_COMPLETION;
      currentXp += REWARD_POINTS.WORKOUT_COMPLETION;

      // Points and XP for completed sets
      const setBonus =
        input.parsedInput.completedSets * REWARD_POINTS.SET_COMPLETION;
      pointsGained += setBonus;
      currentXp += setBonus;

      // Streak bonus
      if (userData.currentStreak > 0) {
        const streakBonus = REWARD_POINTS.STREAK_BONUS * userData.currentStreak;
        pointsGained += streakBonus;
        currentXp += streakBonus;
      }

      // Increment workout count by 1 for this completion
      const workoutCount = userData.workoutsCompleted + 1;

      // Check workout count achievements
      Object.values(ACHIEVEMENTS.WORKOUT_MILESTONES).forEach((milestone) => {
        if (
          workoutCount >= milestone.count &&
          !userData.achievements.includes(milestone.id)
        ) {
          pointsGained += milestone.points;
          currentXp += milestone.points;
          newAchievements.push(milestone.id);
          if (!userData.badges.includes(milestone.badge)) {
            newBadges.push(milestone.badge);
          }
        }
      });

      // Check streak achievements
      Object.values(ACHIEVEMENTS.STREAK_MILESTONES).forEach((milestone) => {
        if (
          userData.currentStreak >= milestone.days &&
          !userData.achievements.includes(milestone.id)
        ) {
          pointsGained += milestone.points;
          currentXp += milestone.points;
          newAchievements.push(milestone.id);
          if (!userData.badges.includes(milestone.badge)) {
            newBadges.push(milestone.badge);
          }
        }
      });

      // Level progression check
      let nextLevelXp = await getRequiredXPForLevel(currentLevel + 1);

      // Keep leveling up while we have enough XP
      while (currentXp >= nextLevelXp) {
        // Level up
        currentLevel++;
        // Subtract XP needed for this level
        currentXp -= nextLevelXp;
        // Add level up bonus points
        pointsGained += REWARD_POINTS.LEVEL_UP_BONUS;
        // Calculate XP needed for next level
        nextLevelXp = await getRequiredXPForLevel(currentLevel + 1);

        // Check level milestone achievements
        Object.values(ACHIEVEMENTS.LEVEL_MILESTONES).forEach((milestone) => {
          if (
            currentLevel >= milestone.level &&
            !userData.achievements.includes(milestone.id)
          ) {
            pointsGained += milestone.points;
            currentXp += milestone.points;
            newAchievements.push(milestone.id);
            if (!userData.badges.includes(milestone.badge)) {
              newBadges.push(milestone.badge);
            }
          }
        });
      }

      // Add gained points to historical total
      newPoints += pointsGained;

      // Store updated gamification data
      const result = await storeGamificationData({
        points: newPoints,
        level: currentLevel,
        workoutsCompleted: workoutCount,
        totalSets: userData.totalSets + input.parsedInput.completedSets,
        achievements: [
          ...new Set([...userData.achievements, ...newAchievements]),
        ],
        badges: [...new Set([...userData.badges, ...newBadges])],
        currentXp: currentXp,
      });

      return {
        success: true,
        data: {
          pointsGained,
          newLevel: currentLevel,
          currentXp,
          nextLevelXp,
          newAchievements,
          newBadges,
        },
      };
    } catch (error) {
      console.error("Error calculating workout rewards:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
