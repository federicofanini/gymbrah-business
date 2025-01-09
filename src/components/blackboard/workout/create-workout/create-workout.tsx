"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, MoveUp, MoveDown } from "lucide-react";
import { createWorkout } from "@/actions/workout/workout";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Exercise {
  id: string;
  name: string;
  category: string;
  muscles: string[];
  outcomes: string[];
}

interface SelectedExercise extends Exercise {
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
}

interface ConfigureWorkoutProps {
  selectedExercises: SelectedExercise[];
  workoutName: string;
  onWorkoutNameChange: (name: string) => void;
  onExerciseUpdate: (
    index: number,
    field: keyof SelectedExercise,
    value: number
  ) => void;
  onRemoveExercise: (index: number) => void;
  onMoveExercise: (index: number, direction: "up" | "down") => void;
  onBack: () => void;
  onSave: () => void;
}

export function ConfigureWorkout({
  selectedExercises,
  workoutName,
  onWorkoutNameChange,
  onExerciseUpdate,
  onRemoveExercise,
  onMoveExercise,
  onBack,
  onSave,
}: ConfigureWorkoutProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const result = await createWorkout({
        name: workoutName,
        exercises: selectedExercises.map((exercise) => ({
          exercise_id: exercise.id,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight || null,
          duration: exercise.duration || null,
        })),
      });

      if (!result?.data?.success) {
        toast.error("Failed to save workout");
        return;
      }

      toast.success("Workout saved successfully");
      router.push("/blackboard/workouts");
      router.refresh();
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-none">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="workout-name">Workout Name</Label>
            <Input
              id="workout-name"
              value={workoutName}
              onChange={(e) => onWorkoutNameChange(e.target.value)}
              placeholder="Enter workout name"
              className="w-full"
            />
          </div>

          <h3 className="text-lg font-semibold mb-4">Configure Exercises</h3>
          <div className="space-y-4">
            {selectedExercises.map((exercise, index) => (
              <div
                key={`${exercise.id}-${index}`}
                className="flex flex-col gap-4 border p-4 rounded-lg"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onMoveExercise(index, "up")}
                        disabled={index === 0}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onMoveExercise(index, "down")}
                        disabled={index === selectedExercises.length - 1}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                    </div>
                    <span className="font-medium">{exercise.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveExercise(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <Label>Sets</Label>
                    <Input
                      type="number"
                      value={exercise.sets}
                      onChange={(e) =>
                        onExerciseUpdate(
                          index,
                          "sets",
                          parseInt(e.target.value)
                        )
                      }
                      min={1}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label>Reps</Label>
                    <Input
                      type="number"
                      value={exercise.reps}
                      onChange={(e) =>
                        onExerciseUpdate(
                          index,
                          "reps",
                          parseInt(e.target.value)
                        )
                      }
                      min={1}
                    />
                  </div>
                  {exercise.category !== "Cardio" && (
                    <div className="flex flex-col gap-1">
                      <Label>Weight (kg)</Label>
                      <Input
                        type="number"
                        value={exercise.weight || ""}
                        onChange={(e) =>
                          onExerciseUpdate(
                            index,
                            "weight",
                            parseInt(e.target.value)
                          )
                        }
                        placeholder="Optional"
                      />
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <Label>Duration (s)</Label>
                    <Input
                      type="number"
                      value={exercise.duration || ""}
                      onChange={(e) =>
                        onExerciseUpdate(
                          index,
                          "duration",
                          parseInt(e.target.value)
                        )
                      }
                      placeholder="Optional"
                    />
                  </div>
                </div>
              </div>
            ))}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                onClick={onBack}
                className="w-full sm:w-auto"
              >
                Back
              </Button>
              <Button
                className="w-full sm:flex-1"
                onClick={handleSave}
                disabled={
                  !workoutName || selectedExercises.length === 0 || isSaving
                }
              >
                {isSaving ? "Saving..." : "Save Workout"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
