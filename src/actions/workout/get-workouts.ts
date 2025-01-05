"use server";

import { prisma } from "@/lib/db";

export async function getWorkoutHistory(userId: string, limit = 10) {
  const workouts = await prisma.workout.findMany({
    where: {
      user_id: userId,
    },
    include: {
      exercises: true,
    },
    orderBy: {
      created_at: "desc",
    },
    take: limit,
  });

  return workouts;
}
