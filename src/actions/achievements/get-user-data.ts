"use server";

import { prisma } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { getRequiredXPForLevel } from "./rewards";

interface GamificationData {
  currentPoints: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  workoutsCompleted: number;
  totalSets: number;
  achievements: string[];
  badges: string[];
  lastWorkoutDate: Date | null;
  currentXP: number;
  next_level_xp: number;
}

/**
 * Gets the current user's gamification data from the database
 * Creates default data if none exists
 * @returns GamificationData object with user's current stats
 */
export async function getUserGamificationData(): Promise<GamificationData> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User not authenticated");
  }

  // Calculate initial XP requirement for level 2
  const initialNextLevelXP = await getRequiredXPForLevel(2);

  // Get existing data or create default
  const data = await prisma.gamification.upsert({
    where: {
      user_id: user.id,
    },
    create: {
      user_id: user.id,
      points: 0,
      level: 1,
      streak_days: 0,
      longest_streak: 0,
      workouts_completed: 0,
      total_sets: 0,
      achievements: [],
      badges: [],
      last_workout_date: null,
      current_xp: 0,
    },
    update: {}, // Add empty update object to satisfy upsert requirements
    select: {
      points: true,
      level: true,
      streak_days: true,
      longest_streak: true,
      workouts_completed: true,
      total_sets: true,
      achievements: true,
      badges: true,
      last_workout_date: true,
      current_xp: true,
      next_level_xp: true,
    },
  });

  return {
    currentPoints: data.points,
    currentLevel: data.level,
    currentStreak: data.streak_days,
    longestStreak: data.longest_streak,
    workoutsCompleted: data.workouts_completed,
    totalSets: data.total_sets,
    achievements: data.achievements,
    badges: data.badges,
    lastWorkoutDate: data.last_workout_date,
    currentXP: data.current_xp,
    next_level_xp: data.next_level_xp,
  };
}
