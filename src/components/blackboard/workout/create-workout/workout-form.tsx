import { getCachedExercises } from "@/actions/workout/cached-workout";
import { WorkoutFormClient } from "./workout-form-client";
import { LogEvents } from "@/utils/events/events";
import { setupAnalytics } from "@/utils/events/server";

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

  const analytics = await setupAnalytics();
  analytics.track({
    event: LogEvents.PageView.name,
    channel: LogEvents.PageView.channel,
    page: "workouts",
  });

  return (
    <WorkoutFormClient
      exercises={exercises}
      uniqueCategories={uniqueCategories}
    />
  );
}
