import { getExercises } from "@/actions/workout/get-exercises";
import { WorkoutFormClient } from "./workout-form-client";
import { LogEvents } from "@/utils/events/events";
import { setupAnalytics } from "@/utils/events/server";
import { getUserMetadata } from "@/utils/supabase/database/cached-queries";
import { createClient } from "@/utils/supabase/server";

interface Exercise {
  id: string;
  name: string;
  body_part: string;
  equipment: string;
  gif_url: string;
  target: string;
  secondary_muscles: string[];
  instructions: string[];
}

export async function WorkoutForm() {
  const supabase = await createClient();
  const result = await getExercises(supabase);
  const exercises = result.success ? (result.data as Exercise[]) : [];

  // Group exercises by body part
  const exercisesByBodyPart = exercises.reduce((acc, exercise) => {
    if (!acc[exercise.body_part]) {
      acc[exercise.body_part] = [];
    }
    acc[exercise.body_part].push(exercise);
    return acc;
  }, {} as Record<string, Exercise[]>);

  // Get unique body parts for categories
  const uniqueCategories = Object.keys(exercisesByBodyPart);

  const analytics = await setupAnalytics();
  analytics.track({
    event: LogEvents.WorkoutCreated.name((await getUserMetadata())?.full_name),
    channel: LogEvents.WorkoutCreated.channel,
    page: "workouts",
  });

  return (
    <WorkoutFormClient
      exercises={exercises}
      uniqueCategories={uniqueCategories}
    />
  );
}
