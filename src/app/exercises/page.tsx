import { Suspense } from "react";
import { BODY_PARTS } from "@/app/api/config";
import { ExercisesList } from "@/app/exercises/exercises-list";
import { getExercises } from "./actions";

export async function generateMetadata() {
  return {
    title: "Exercise Database | Find Exercises by Body Part",
    description:
      "Browse and search exercises by body part. View exercise details including instructions, target muscles, and proper form.",
  };
}

async function getInitialExercises() {
  try {
    const result = await getExercises({
      bodyPart: BODY_PARTS.BACK,
      limit: 10,
      offset: 0,
    });

    if (!result?.data?.success || !result?.data?.data) {
      throw new Error(result?.data?.error || "Failed to fetch exercises");
    }

    return result.data.data;
  } catch (error) {
    console.error("Error fetching initial exercises:", error);
    return []; // Return empty array as fallback
  }
}

export default async function ExercisesPage() {
  const initialExercises = await getInitialExercises();

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Exercise Database</h1>
      <p className="text-muted-foreground mb-8">
        Browse exercises by body part. Click on an exercise to view detailed
        instructions and form tips.
      </p>

      <Suspense fallback={<div>Loading exercises...</div>}>
        <ExercisesList initialExercises={initialExercises} />
      </Suspense>
    </div>
  );
}
