import { getWorkoutExercises } from "@/actions/workout/athlete/workout-info";
import { WorkoutPage } from "@/components/private/b2c/workout/workout-page";
import { notFound } from "next/navigation";

// Define the type for the dynamic route params
type PageParams = { workoutId: string } & Promise<any>;

export default async function Workout({ params }: { params: PageParams }) {
  const response = await getWorkoutExercises({
    workoutId: params.workoutId,
  });

  if (!response?.data?.success || !response?.data?.data) {
    return (
      <div className="container max-w-[1050px] py-12">
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Unable to load workout details
          </p>
        </div>
      </div>
    );
  }

  return <WorkoutPage exercises={response.data.data} />;
}
