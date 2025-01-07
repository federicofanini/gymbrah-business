"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { Dumbbell } from "lucide-react";
import confetti from "canvas-confetti";
import { getActiveWorkout } from "@/actions/workout/get-workouts";
import { toast } from "sonner";
import { type ActionResponse } from "@/actions/types/action-response";
import { Badge } from "../ui/badge";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  isCompleted: boolean;
}

export function WorkoutPlan() {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    async function fetchActiveWorkout() {
      try {
        const result = await getActiveWorkout();

        if (!result) {
          throw new Error("No response from server");
        }

        if (result.data) {
          const response = result.data as ActionResponse;
          if (response.success && response.data) {
            setExercises(
              response.data.exercises.map((exercise: Exercise) => ({
                ...exercise,
                isCompleted: false,
              }))
            );
          } else {
            toast.error(response.error || "Failed to load workout plan");
          }
        }
      } catch (error) {
        console.error("Failed to fetch active workout:", error);
        toast.error("Failed to load workout plan");
      }
    }

    fetchActiveWorkout();
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleCheck = (exerciseId: string) => {
    setExercises((prev) => {
      return prev.map((exercise) => {
        if (exercise.id === exerciseId) {
          if (!exercise.isCompleted) {
            triggerConfetti();
          }
          return { ...exercise, isCompleted: !exercise.isCompleted };
        }
        return exercise;
      });
    });
  };

  return (
    <Card className="w-full md:w-1/3">
      <CardHeader>
        <CardTitle className="text-lg">Daily Workout Plan</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {exercises.map((exercise) => (
          <div key={exercise.id} className="flex items-center space-x-2">
            <Checkbox
              id={exercise.id}
              checked={exercise.isCompleted}
              onCheckedChange={() => handleCheck(exercise.id)}
            />
            <label
              htmlFor={exercise.id}
              className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              <Dumbbell className="h-4 w-4" />
              {exercise.name}{" "}
              <Badge variant="secondary">
                {exercise.sets} sets x {exercise.reps} reps
              </Badge>
            </label>
          </div>
        ))}
        {exercises.length === 0 && (
          <div className="text-sm text-muted-foreground">
            No active workout plan found
          </div>
        )}
      </CardContent>
    </Card>
  );
}
