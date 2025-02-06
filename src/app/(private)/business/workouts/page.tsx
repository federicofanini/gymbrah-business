import { WorkoutPage } from "@/components/private/workout";
import { getExercisesByBodyPart } from "@/actions/exercises/exercise-by-bodyPart";
import { bodyParts } from "@/actions/exercises/bodyParts";
import { getExercises } from "@/actions/exercises/exercises-list";
import { getWorkout } from "@/actions/workout/get-workout";

interface SearchParams {
  bodyPart?: string;
  page?: string;
}

export default async function Workouts({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const selectedBodyPart = (await searchParams).bodyPart || "all";
  const currentPage = Number((await searchParams).page) || 1;
  const pageSize = 25;

  // Fetch exercises for selected body part
  const exercisesResponse = await getExercisesByBodyPart({
    bodyPart: selectedBodyPart,
    page: currentPage,
    limit: pageSize,
  });

  if (!exercisesResponse?.data?.success) {
    throw new Error(exercisesResponse?.data?.error as string);
  }

  // Fetch initial exercises for all body parts
  const initialExercisesResponse = await getExercises({
    page: 1,
    limit: 10, // Fetch more initial exercises to have a good base for filtering
  });

  if (!initialExercisesResponse?.data?.success) {
    throw new Error(initialExercisesResponse?.data?.error as string);
  }

  // Fetch workouts
  const workoutsResponse = await getWorkout({
    businessId: "592c43fa-ef79-414e-af58-885bcd3469e7", // You'll need to pass the actual business ID
  });

  if (!workoutsResponse?.data?.success) {
    throw new Error(workoutsResponse?.data?.error as string);
  }

  return (
    <div className="space-y-4">
      <WorkoutPage
        exercises={exercisesResponse.data.data}
        initialExercises={initialExercisesResponse.data.data.exercises}
        workouts={workoutsResponse.data.data}
      />
    </div>
  );
}
