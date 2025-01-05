"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWorkoutHistory } from "@/actions/workout/get-workouts";
import { Dumbbell, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { selectWorkout, deleteWorkout } from "@/actions/workout/workout";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Exercise {
  id: string;
  name: string;
  reps: number;
  sets: number;
  weight?: number;
  workout_id: string;
}

interface Workout {
  id: string;
  user_id: string;
  created_at: Date;
  exercises: Exercise[];
  selected: boolean;
}

export function SavedWorkouts({ userId }: { userId: string }) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    async function fetchWorkouts() {
      const workoutHistory = await getWorkoutHistory(userId);
      setWorkouts(workoutHistory as Workout[]);
    }

    fetchWorkouts();
  }, [userId]);

  const handleSelectWorkout = async (workoutId: string) => {
    try {
      const result = await selectWorkout({ workoutId });
      if (!result) {
        throw new Error("No response from server");
      }

      if (result.data) {
        const response = result.data;
        if (response.success) {
          setWorkouts(
            workouts.map((workout) => ({
              ...workout,
              selected: workout.id === workoutId,
            }))
          );
          toast.success("Workout selected successfully");
        } else {
          toast.error(response.error || "Failed to select workout");
        }
      }
    } catch (error) {
      console.error("Workout selection error:", error);
      toast.error("Failed to select workout");
    }
  };

  const handleDeleteWorkout = async (workoutId: string) => {
    try {
      const result = await deleteWorkout({ workoutId });
      if (!result) {
        throw new Error("No response from server");
      }

      if (result.data) {
        const response = result.data;
        if (response.success) {
          setWorkouts(workouts.filter((workout) => workout.id !== workoutId));
          toast.success("Workout deleted successfully");
        } else {
          toast.error(response.error || "Failed to delete workout");
        }
      }
    } catch (error) {
      console.error("Workout deletion error:", error);
      toast.error("Failed to delete workout");
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Workout History</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {workouts.map((workout) => (
          <Card key={workout.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Created on{" "}
                  <Badge variant="outline">
                    {new Date(workout.created_at)
                      .toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                      .replace(/(\d+)(?=(,\s\d{4}))/, (match) => {
                        const num = parseInt(match);
                        const suffix = ["th", "st", "nd", "rd"][
                          num % 10 > 3 || (num % 100) - (num % 10) == 10
                            ? 0
                            : num % 10
                        ];
                        return num + suffix;
                      })}
                  </Badge>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Switch
                      checked={workout.selected}
                      onCheckedChange={() => handleSelectWorkout(workout.id)}
                    />
                    <span className="text-xs text-muted-foreground">
                      Active
                    </span>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteWorkout(workout.id)}
                    className="size-6"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              {workout.exercises.map((exercise) => (
                <div key={exercise.id} className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Dumbbell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{exercise.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {exercise.sets} sets × {exercise.reps} reps
                      {exercise.weight && ` @ ${exercise.weight}kg`}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
        {workouts.length === 0 && (
          <Card className="md:col-span-3">
            <CardContent className="flex flex-col items-center gap-4 py-8">
              <div className="rounded-full bg-primary/10 p-4">
                <Dumbbell className="h-8 w-8 text-primary animate-pulse" />
              </div>
              <div className="space-y-2 text-center">
                <h3 className="font-semibold">No Workouts Yet</h3>
                <p className="text-sm text-muted-foreground">
                  Time to start your fitness journey! Create your first workout
                  and track your progress.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
