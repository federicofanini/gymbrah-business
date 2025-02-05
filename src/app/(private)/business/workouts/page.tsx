import { WorkoutPage } from "@/components/private/workout";
import { getExercisesByBodyPart } from "@/actions/exercises/exercise-by-bodyPart";
import { bodyParts } from "@/actions/exercises/bodyParts";

interface SearchParams {
  bodyPart?: string;
  page?: string;
}

export default async function Workouts({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const selectedBodyPart = searchParams.bodyPart || "all";
  const currentPage = Number(searchParams.page) || 1;
  const pageSize = 10;

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
  const initialExercisesResponse = await getExercisesByBodyPart({
    bodyPart: "back",
    page: 1,
    limit: 10,
  });

  if (!initialExercisesResponse?.data?.success) {
    throw new Error(initialExercisesResponse?.data?.error as string);
  }

  return (
    <div className="space-y-4">
      <WorkoutPage
        exercises={exercisesResponse.data.data}
        initialExercises={initialExercisesResponse.data.data.exercises}
      />
    </div>
  );
}
