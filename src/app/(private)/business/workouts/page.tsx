import { WorkoutPage } from "@/components/private/workout";
import { getExercises } from "@/actions/exercises/exercises-list";

export default async function Workouts({
  searchParams,
}: {
  searchParams: {
    bodyPart?: string;
    page?: string;
    search?: string;
  };
}) {
  const selectedBodyPart = searchParams.bodyPart || "all";
  const currentPage = Number(searchParams.page) || 1;
  const searchQuery = searchParams.search || "";
  const pageSize = 10;

  // Fetch exercises based on filters
  const exercisesResponse = await getExercises({
    page: currentPage,
    limit: pageSize,
    bodyPart: selectedBodyPart === "all" ? undefined : selectedBodyPart,
    search: searchQuery || undefined,
  });

  if (!exercisesResponse?.data?.success) {
    throw new Error(exercisesResponse?.data?.error);
  }

  // Get initial exercises for the exercise library
  const initialExercisesResponse = await getExercises({
    page: 1,
    limit: pageSize,
  });

  if (!initialExercisesResponse?.data?.success) {
    throw new Error(initialExercisesResponse?.data?.error);
  }

  return (
    <WorkoutPage
      initialExercises={initialExercisesResponse.data.data.exercises}
      exercises={exercisesResponse.data.data}
    />
  );
}
