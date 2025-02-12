import { getWorkoutExercises } from "@/actions/workout/athlete/workout-info";
import { WorkoutPage } from "@/components/private/b2c/workout/workout-page";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    workoutId: string;
  };
}

export default async function Page({ params }: PageProps) {
  const response = await getWorkoutExercises({
    workoutId: params.workoutId,
  });

  if (!response?.data?.success) {
    notFound();
  }

  return <WorkoutPage exercises={response.data.data} />;
}
