"use client";

import { useState } from "react";
import { createWorkout } from "@/actions/workout/workout";
import { getWorkoutHistory } from "@/actions/workout/get-workouts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Dumbbell, X } from "lucide-react";
import { toast } from "sonner";
import { type ActionResponse } from "@/actions/types/action-response";
import { categories, muscles, outcomes } from "./exercises-list";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Exercise {
  name: string;
  reps: number;
  sets: number;
  weight?: number;
  category?: string;
  muscles: string[];
  outcomes: string[];
}

export function WorkoutForm({ userId }: { userId: string }) {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await createWorkout({
        userId,
        exercises: exercises.map((exercise) => ({
          name: exercise.name,
          reps: exercise.reps,
          sets: exercise.sets,
          weight: exercise.weight,
          category: exercise.category || "",
          muscles: exercise.muscles,
          outcomes: exercise.outcomes,
        })),
      });

      if (result?.data) {
        const response = result.data as ActionResponse;
        if (response.success) {
          setExercises([]);
          await getWorkoutHistory(userId);
          toast.success("Workout saved successfully");
        } else {
          toast.error(response.error || "Failed to save workout");
        }
      }
    } catch (error) {
      console.error("Workout submission error:", error);
      toast.error("Failed to save workout");
    }
  };

  const addExercise = () => {
    setExercises([
      ...exercises,
      {
        name: "",
        reps: 0,
        sets: 0,
        weight: undefined,
        category: undefined,
        muscles: [],
        outcomes: [],
      },
    ]);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (
    index: number,
    field: keyof Exercise,
    value: string | number | string[]
  ) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]:
        field === "muscles" || field === "outcomes"
          ? value
          : field === "name" || field === "category"
          ? value
          : Number(value),
    };
    setExercises(updatedExercises);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Log Workout</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {exercises.map((exercise, index) => (
            <div
              key={index}
              className="space-y-4 p-4 border rounded-lg relative"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => removeExercise(index)}
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`exercise-name-${index}`}>
                    Exercise Details
                  </Label>
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Dumbbell className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex flex-col space-y-2 w-full">
                      <Input
                        id={`exercise-name-${index}`}
                        value={exercise.name}
                        onChange={(e) =>
                          updateExercise(index, "name", e.target.value)
                        }
                        placeholder="Exercise name"
                      />

                      <Select
                        value={exercise.category}
                        onValueChange={(value) =>
                          updateExercise(index, "category", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(categories).map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={exercise.muscles?.[0]}
                        onValueChange={(value) =>
                          updateExercise(index, "muscles", [value])
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select primary muscle" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(muscles).map((muscle) => (
                            <SelectItem key={muscle} value={muscle}>
                              {muscle}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={exercise.outcomes?.[0]}
                        onValueChange={(value) =>
                          updateExercise(index, "outcomes", [value])
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select primary outcome" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(outcomes).map((outcome) => (
                            <SelectItem key={outcome} value={outcome}>
                              {outcome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`exercise-sets-${index}`}>Sets</Label>
                    <Input
                      id={`exercise-sets-${index}`}
                      type="number"
                      value={exercise.sets || ""}
                      onChange={(e) =>
                        updateExercise(index, "sets", e.target.value)
                      }
                      placeholder="3"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`exercise-reps-${index}`}>Reps</Label>
                    <Input
                      id={`exercise-reps-${index}`}
                      type="number"
                      value={exercise.reps || ""}
                      onChange={(e) =>
                        updateExercise(index, "reps", e.target.value)
                      }
                      placeholder="12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`exercise-weight-${index}`}>
                      Weight (kg)
                    </Label>
                    <Input
                      id={`exercise-weight-${index}`}
                      type="number"
                      value={exercise.weight || ""}
                      onChange={(e) =>
                        updateExercise(index, "weight", e.target.value)
                      }
                      placeholder="50"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={addExercise}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Exercise
          </Button>

          <Button
            type="submit"
            className="w-full"
            disabled={exercises.length === 0}
          >
            Save Workout
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
