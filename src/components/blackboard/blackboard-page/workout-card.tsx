import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Dumbbell, PersonStanding, Zap } from "lucide-react";
import { estimateWorkoutTime } from "@/actions/workout/time-estimation";
import {
  getCachedSelectedWorkout,
  getCachedWorkoutFrequency,
} from "@/actions/workout/cached-workout";

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
  frequency: string;
}

export async function WorkoutCard({ workoutData }: { workoutData?: Workout }) {
  // Get current day of week (1-7, Monday = 1)
  const today = new Date().getDay();
  const dayNumber = today === 0 ? "7" : today.toString();

  let selectedWorkout: Workout;

  if (workoutData) {
    selectedWorkout = workoutData;
  } else {
    // Get user's workout frequency
    const frequencyResponse = await getCachedWorkoutFrequency();

    if (!frequencyResponse.success || !frequencyResponse.data) {
      return null;
    }

    // Get user's workout days
    const userWorkoutDays = frequencyResponse.data.frequency?.split(",") || [];

    // Get selected workout
    const workoutResponse = await getCachedSelectedWorkout();

    if (!workoutResponse.success || !workoutResponse.data) {
      return null;
    }

    selectedWorkout = workoutResponse.data;

    // Get workout's frequency days
    const workoutFrequencyDays = selectedWorkout.frequency?.split(",") || [];

    // Check if today matches both user's frequency and workout's frequency
    if (
      !userWorkoutDays.includes(dayNumber) ||
      !workoutFrequencyDays.includes(dayNumber)
    ) {
      return null;
    }
  }

  // Estimate workout time
  const timeResponse = await estimateWorkoutTime(
    selectedWorkout.exercises.map((e: Exercise) => ({
      exercise_id: e.exercise_id,
      sets: e.sets,
      reps: e.reps,
      duration: e.duration || null,
    }))
  );

  let estimatedTime = "";
  if (timeResponse.success && timeResponse.data) {
    const { hours, minutes } = timeResponse.data.formatted;
    estimatedTime = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }

  const points = 500;

  // Get unique muscle groups
  const muscleGroups = Array.from(
    new Set(
      selectedWorkout.exercises.flatMap(
        (exercise: Exercise) => exercise.muscles
      )
    )
  ) as string[];

  // Get unique equipment (categories)
  const equipment = Array.from(
    new Set(
      selectedWorkout.exercises.map((exercise: Exercise) => exercise.category)
    )
  ).join(", ");

  return (
    <Card className="w-full p-2.5 sm:p-4 space-y-2.5 sm:space-y-4 bg-[#1a2e35] text-white">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1.5 sm:gap-4">
        <div className="space-y-1.5 sm:space-y-3 flex justify-between gap-2 items-center">
          <h2 className="text-base sm:text-2xl font-semibold line-clamp-2 uppercase">
            {selectedWorkout.name}
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
