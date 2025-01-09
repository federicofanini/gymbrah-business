"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import type { ActionResponse } from "@/actions/types/action-response";
import { ExercisesTable } from "./exercises/exercises-table";
import { ConfigureWorkout } from "./create-workout";
import { WorkoutInstructions } from "./workout-instructions";
import { Separator } from "@/components/ui/separator";

interface Exercise {
  id: string;
  name: string;
  category: string;
  muscles: string[];
  outcomes: string[];
}

interface WorkoutFormClientProps {
  exercises: Exercise[];
  uniqueCategories: string[];
}

interface SelectedExercise extends Exercise {
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
}

const saveWorkoutSchema = z.object({
  name: z.string().min(1),
  exercises: z.array(
    z.object({
      exerciseId: z.string(),
      sets: z.number().min(1),
      reps: z.number().min(1),
      weight: z.number().optional(),
      duration: z.number().optional(),
    })
  ),
});

const saveWorkout = createSafeActionClient()
  .schema(saveWorkoutSchema)
  .action(async ({ parsedInput }): Promise<ActionResponse> => {
    try {
      // Add your save workout logic here
      return { success: true };
    } catch (error) {
      return { success: false, error: error as string };
    }
  });

export function WorkoutFormClient({
  exercises,
  uniqueCategories,
}: WorkoutFormClientProps) {
  const [step, setStep] = useState(1);
  const [workoutName, setWorkoutName] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<
    SelectedExercise[]
  >([]);

  const handleExerciseSelect = (exercise: Exercise) => {
    if (!selectedExercises.some((e) => e.id === exercise.id)) {
      setSelectedExercises([
        ...selectedExercises,
        { ...exercise, sets: 3, reps: 10 },
      ]);
    }
  };

  const handleRemoveExercise = (index: number) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  const handleExerciseUpdate = (
    index: number,
    field: keyof SelectedExercise,
    value: number
  ) => {
    const updatedExercises = [...selectedExercises];
    updatedExercises[index] = { ...updatedExercises[index], [field]: value };
    setSelectedExercises(updatedExercises);
  };

  const moveExercise = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < selectedExercises.length) {
      const updatedExercises = [...selectedExercises];
      [updatedExercises[index], updatedExercises[newIndex]] = [
        updatedExercises[newIndex],
        updatedExercises[index],
      ];
      setSelectedExercises(updatedExercises);
    }
  };

  const handleSaveWorkout = async () => {
    await saveWorkout({
      name: workoutName,
      exercises: selectedExercises.map((exercise) => ({
        exerciseId: exercise.id,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight,
        duration: exercise.duration,
      })),
    });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="px-2 md:px-0">
        <WorkoutInstructions />
      </div>

      <Separator className="mx-2 md:mx-0" />

      {/* Step 1: Select Exercises */}
      {step === 1 && (
        <Card className="border-none mx-2 md:mx-0">
          <CardContent className="p-2 md:p-6">
            <ExercisesTable
              exercises={exercises}
              uniqueCategories={uniqueCategories}
              selectedExercises={selectedExercises}
              onExerciseSelect={handleExerciseSelect}
            />

            {selectedExercises.length > 0 && (
              <Button
                className="w-full mt-4 text-sm md:text-base"
                onClick={() => setStep(2)}
              >
                Next Step <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <div className="px-2 md:px-0">
          <ConfigureWorkout
            selectedExercises={selectedExercises}
            workoutName={workoutName}
            onWorkoutNameChange={setWorkoutName}
            onExerciseUpdate={handleExerciseUpdate}
            onRemoveExercise={handleRemoveExercise}
            onMoveExercise={moveExercise}
            onBack={() => setStep(1)}
            onSave={handleSaveWorkout}
          />
        </div>
      )}
    </div>
  );
}
