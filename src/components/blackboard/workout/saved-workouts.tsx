import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getWorkouts } from "@/actions/workout/get-workouts";
import { getCachedExercises } from "@/actions/workout/cached-workout";
import { WorkoutActions } from "./create-workout/workout-actions";
import { createClient } from "@/utils/supabase/server";

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

interface CachedExercise {
  id: string;
  name: string;
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

export async function SavedWorkouts() {
  const supabase = await createClient();
  const [workoutsResponse, exercisesResponse] = await Promise.all([
    getWorkouts(supabase),
    getCachedExercises(),
  ]);

  let workouts: Workout[] = [];

  if (
    workoutsResponse.success &&
    workoutsResponse.data &&
    exercisesResponse?.success &&
    exercisesResponse?.data
  ) {
    // Create a map of exercise details for quick lookup
    const exerciseMap = new Map<string, CachedExercise>(
      exercisesResponse.data.map((exercise: CachedExercise) => [
        exercise.id,
        exercise,
      ])
    );

    // Enrich workout exercises with cached exercise details
    workouts = workoutsResponse.data.map((workout: Workout) => ({
      ...workout,
      exercises: workout.exercises.map((exercise) => {
        const cachedExercise = exerciseMap.get(exercise.exercise_id);
        return cachedExercise
          ? {
              ...exercise,
              name: cachedExercise.name,
              category: cachedExercise.category,
              muscles: cachedExercise.muscles,
              outcomes: cachedExercise.outcomes,
            }
          : exercise;
      }),
    }));
  }

  return (
    <div className="w-full px-4 sm:px-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Your workouts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {workouts.map((workout) => (
          <Card key={workout.id} className="w-full">
            <CardHeader className="p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <CardTitle className="text-base sm:text-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="truncate">{workout.name}</span>
                    <Badge variant="outline" className="w-fit text-xs">
                      {new Date(workout.created_at)
                        .toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                        .replace(/(\d+)(?=(,\s\d{4}))/, (match) => {
                          const num = parseInt(match);
                          const suffix = ["th", "st", "nd", "rd"][
                            num % 10 > 3 || (num % 100) - (num % 10) == 10
                              ? 0
                              : num % 10
                          ];
                          return num + suffix;
                        })}
                    </Badge>
                  </div>
                </CardTitle>
                <WorkoutActions workout={workout} />
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 p-4">
              {workout.exercises.map((exercise) => (
                <div key={exercise.id} className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg shrink-0">
                    <Dumbbell className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">
                      {exercise.name}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {exercise.sets} sets × {exercise.reps} reps
                      {exercise.weight && ` @ ${exercise.weight}kg`}
                      {exercise.duration && ` for ${exercise.duration}s`}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
        {workouts.length === 0 && (
          <Card className="sm:col-span-2 lg:col-span-3">
            <CardContent className="flex flex-col items-center gap-4 py-6 sm:py-8">
              <div className="rounded-full bg-primary/10 p-3 sm:p-4">
                <Dumbbell className="h-6 w-6 sm:h-8 sm:w-8 text-primary animate-pulse" />
              </div>
              <div className="space-y-1 sm:space-y-2 text-center px-4">
                <h3 className="font-semibold text-sm sm:text-base">
                  No Workouts Yet
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Time to start your fitness journey! Create your first workout
                  and track your progress.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
