import { getCachedExercises } from "@/actions/workout/cached-workout";
import { WorkoutFormClient } from "./workout-form-client";

interface Exercise {
  id: string;
  name: string;
  category: string;
  muscles: string[];
  outcomes: string[];
}

export async function WorkoutForm() {
  const result = await getCachedExercises();
  const exercises = result.success ? (result.data as Exercise[]) : [];

  // Get unique categories
  const uniqueCategories = Array.from(
    new Set(exercises.map((exercise) => exercise.category))
  );

  return (
    <WorkoutFormClient
      exercises={exercises}
      uniqueCategories={uniqueCategories}
    />
  );
}
