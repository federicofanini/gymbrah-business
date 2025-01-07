"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Dumbbell, PersonStanding, Zap } from "lucide-react";
import { getSelectedWorkout } from "@/actions/workout/get-workouts";
import { estimateWorkoutTime } from "@/actions/workout/time-estimation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface Exercise {
  id: string;
  name: string;
  reps: number;
  sets: number;
  weight?: number | null;
  duration?: number | null;
  workout_id: string;
  exercise_id: string;
  category: string;
  muscles: string[];
  outcomes: string[];
}

interface Workout {
  id: string;
  name: string;
  created_at: Date;
  exercises: Exercise[];
  selected: boolean;
}

export function WorkoutCard() {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [estimatedTime, setEstimatedTime] = useState<string>("");

  useEffect(() => {
    async function fetchWorkout() {
      try {
        const response = await getSelectedWorkout();
        if (response.success && response.data) {
          setWorkout(response.data);

          // Estimate workout time
          const timeResponse = await estimateWorkoutTime(
            response.data.exercises.map((e: Exercise) => ({
              exercise_id: e.exercise_id,
              sets: e.sets,
              reps: e.reps,
              duration: e.duration,
            }))
          );

          if (timeResponse.success && timeResponse.data) {
            const { hours, minutes } = timeResponse.data.formatted;
            setEstimatedTime(
              hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
            );
          }
        }
      } catch (error) {
        console.error("Error fetching workout:", error);
        toast.error("Failed to fetch workout");
      } finally {
        setIsLoading(false);
      }
    }

    fetchWorkout();
  }, []);

  if (isLoading) {
    return (
      <Card className="w-full p-2.5 sm:p-4 space-y-2.5 sm:space-y-4 bg-[#1a2e35] text-white">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1.5 sm:gap-4">
          <div className="space-y-1.5 sm:space-y-3 flex justify-between gap-2 items-center w-full">
            <Skeleton className="h-6 sm:h-8 w-1/3 bg-gray-700" />
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <Skeleton className="h-4 w-16 bg-gray-700" />
              <Skeleton className="h-4 w-16 bg-gray-700" />
            </div>
          </div>
        </div>

        <div className="space-y-1.5 sm:space-y-3">
          <div className="flex items-center gap-1 sm:gap-2">
            <Skeleton className="h-4 w-full bg-gray-700" />
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Skeleton className="h-4 w-3/4 bg-gray-700" />
          </div>
        </div>
      </Card>
    );
  }

  if (!workout) return null;

  const points = 500;

  // Get unique muscle groups
  const muscleGroups = Array.from(
    new Set(workout.exercises.flatMap((exercise) => exercise.muscles))
  );

  // Get unique equipment (categories)
  const equipment = Array.from(
    new Set(workout.exercises.map((exercise) => exercise.category))
  ).join(", ");

  return (
    <Card className="w-full p-2.5 sm:p-4 space-y-2.5 sm:space-y-4 bg-[#1a2e35] text-white">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1.5 sm:gap-4">
        <div className="space-y-1.5 sm:space-y-3 flex justify-between gap-2 items-center">
          <h2 className="text-base sm:text-2xl font-semibold line-clamp-2 uppercase">
            {workout.name}
          </h2>
          <div className="flex flex-wrap gap-2 sm:gap-4 text-[11px] sm:text-sm text-gray-300">
            <div className="flex items-center gap-1 sm:gap-2">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              {estimatedTime}
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
              {points} points
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-1.5 sm:space-y-3">
        <div className="flex items-center gap-1 sm:gap-2 text-[11px] sm:text-sm">
          <PersonStanding className="h-3 w-3 sm:h-4 sm:w-4" />
          <ScrollArea className="w-full">
            <div className="flex gap-1 sm:gap-2">
              {muscleGroups.map((group, index) => (
                <span key={index} className="whitespace-nowrap">
                  {index > 0 && "-  "}
                  {group}
                </span>
              ))}
            </div>
          </ScrollArea>
        </div>

        {equipment && (
          <div className="flex items-center gap-1 sm:gap-2 text-[11px] sm:text-sm">
            <Dumbbell className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            {equipment}
          </div>
        )}
      </div>
    </Card>
  );
}
