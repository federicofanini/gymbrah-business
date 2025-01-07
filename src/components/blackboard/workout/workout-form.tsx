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
import { categories, muscles, outcomes, exercises } from "./exercises-list";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Exercise {
  name: string;
  reps?: number;
  sets?: number;
  weight?: number;
  duration?: number;
  category: string;
  muscles: string[];
  outcomes: string[];
}

export function WorkoutForm({ userId }: { userId: string }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null);
  const [workoutExercises, setWorkoutExercises] = useState<Exercise[]>([]);

  const filteredExercises = Object.values(exercises).filter((exercise) => {
    return (
      (!selectedCategory || exercise.name.includes(selectedCategory)) &&
      (!selectedMuscle || exercise.muscles.includes(selectedMuscle)) &&
      (!selectedOutcome || exercise.outcomes.includes(selectedOutcome))
    );
  });

  const handleAddExercise = (exercise: any) => {
    setWorkoutExercises([
      ...workoutExercises,
      {
        name: exercise.name,
        category: selectedCategory || exercise.category || "",
        muscles: exercise.muscles,
        outcomes: exercise.outcomes,
        sets: 0,
        reps: 0,
        weight: 0,
        duration: 0,
      },
    ]);
  };

  const updateExercise = (
    index: number,
    field: keyof Exercise,
    value: string | number | string[]
  ) => {
    const updatedExercises = [...workoutExercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: typeof value === "string" ? Number(value) : value,
    };
    setWorkoutExercises(updatedExercises);
  };

  const removeExercise = (index: number) => {
    setWorkoutExercises(workoutExercises.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createWorkout({
        userId,
        exercises: workoutExercises.map((exercise) => ({
          name: exercise.name,
          reps: exercise.reps || 0,
          sets: exercise.sets || 0,
          weight: exercise.weight || 0,
          duration: exercise.duration || 0,
        })),
      });

      if (result?.data) {
        const response = result.data as ActionResponse;
        if (response.success) {
          setWorkoutExercises([]);
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

  // Group exercises by category for the workout builder
  const exercisesByCategory = workoutExercises.reduce((acc, exercise) => {
    const category = exercise.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(exercise);
    return acc;
  }, {} as Record<string, Exercise[]>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Exercise Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Select
              onValueChange={setSelectedCategory}
              value={selectedCategory || undefined}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.values(categories).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={setSelectedMuscle}
              value={selectedMuscle || undefined}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by muscle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Muscles</SelectItem>
                {Object.values(muscles).map((muscle) => (
                  <SelectItem key={muscle} value={muscle}>
                    {muscle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={setSelectedOutcome}
              value={selectedOutcome || undefined}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by outcome" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Outcomes</SelectItem>
                {Object.values(outcomes).map((outcome) => (
                  <SelectItem key={outcome} value={outcome}>
                    {outcome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredExercises.map((exercise) => (
              <Button
                key={exercise.name}
                variant="outline"
                className="h-auto py-4 px-3 flex flex-col items-center text-center"
                onClick={() => handleAddExercise(exercise)}
              >
                <Dumbbell className="h-5 w-5 mb-2" />
                <span className="text-sm">{exercise.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workout Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {Object.entries(exercisesByCategory).map(
              ([category, exercises]) => (
                <div key={category} className="space-y-4">
                  <h3 className="font-semibold text-lg">{category}</h3>
                  {exercises.map((exercise, index) => (
                    <div
                      key={`${exercise.name}-${index}`}
                      className="p-4 border rounded-lg relative"
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

                      <div className="space-y-4">
                        <div className="font-medium">{exercise.name}</div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label>Sets</Label>
                            <Input
                              type="number"
                              value={exercise.sets || ""}
                              onChange={(e) =>
                                updateExercise(index, "sets", e.target.value)
                              }
                              placeholder="3"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Reps</Label>
                            <Input
                              type="number"
                              value={exercise.reps || ""}
                              onChange={(e) =>
                                updateExercise(index, "reps", e.target.value)
                              }
                              placeholder="12"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Weight (kg)</Label>
                            <Input
                              type="number"
                              value={exercise.weight || ""}
                              onChange={(e) =>
                                updateExercise(index, "weight", e.target.value)
                              }
                              placeholder="50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Duration (s)</Label>
                            <Input
                              type="number"
                              value={exercise.duration || ""}
                              onChange={(e) =>
                                updateExercise(
                                  index,
                                  "duration",
                                  e.target.value
                                )
                              }
                              placeholder="30"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {workoutExercises.length > 0 && (
              <Button type="submit" className="w-full">
                Save Workout
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
