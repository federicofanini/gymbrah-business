"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import { AssignDialog } from "./assign-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

interface Exercise {
  id: string;
  name: string;
  body_part: string;
  equipment: string;
  target: string;
  gif_url: string;
  secondary_muscles: string[];
  instructions: string[];
}

interface WorkoutExercise {
  id: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
  round?: string;
  exercise: Exercise;
}

export interface Workout {
  id: string;
  name: string;
  date: string;
  status: "completed" | "scheduled" | "missed";
  type: string;
  duration: number;
  created_at: string;
  exercises: WorkoutExercise[];
}

interface WorkoutsTabProps {
  workouts: Workout[];
  athleteId: string;
}

export function WorkoutsTab({ workouts, athleteId }: WorkoutsTabProps) {
  const [view] = useQueryState("view", {
    defaultValue: "upcoming",
  });
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  const statusVariant = {
    completed: "success",
    scheduled: "secondary",
    missed: "destructive",
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <h2 className="text-xl md:text-2xl font-semibold">Workouts</h2>
        <AssignDialog athleteId={athleteId} />
      </div>

      <div className="grid gap-3 md:gap-4">
        {workouts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No workouts assigned yet
          </div>
        ) : (
          workouts.map((workout) => (
            <Card key={workout.id}>
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start sm:items-center gap-4 md:gap-6">
                    <Calendar className="size-6 md:size-8 text-muted-foreground shrink-0" />
                    <div>
                      <h3 className="font-semibold text-sm md:text-base">
                        {workout.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <Badge variant="outline" className="text-xs md:text-sm">
                          {workout.type}
                        </Badge>
                        <span className="text-xs md:text-sm text-muted-foreground">
                          {new Date(workout.date).toLocaleDateString()} •{" "}
                          {workout.duration} min
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 mt-2 sm:mt-0">
                    <Badge
                      variant="outline"
                      className="text-xs md:text-sm whitespace-nowrap"
                    >
                      {workout.status.charAt(0).toUpperCase() +
                        workout.status.slice(1)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs md:text-sm"
                      onClick={() => setSelectedWorkout(workout)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog
        open={!!selectedWorkout}
        onOpenChange={() => setSelectedWorkout(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedWorkout?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                {new Date(selectedWorkout?.date || "").toLocaleDateString()}
              </span>
              <span>•</span>
              <span>{selectedWorkout?.duration} min</span>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Exercises</h3>
              <div className="grid gap-3">
                {selectedWorkout?.exercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="border rounded-lg p-4 flex items-center gap-2"
                  >
                    <span className="font-medium capitalize flex items-center gap-2">
                      <img
                        src={exercise.exercise.gif_url}
                        alt={exercise.exercise.name}
                        className="size-10 rounded-full"
                      />
                      {exercise.exercise.name}
                    </span>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      {exercise.sets ? (
                        <div>
                          <span className="text-muted-foreground">Sets:</span>{" "}
                          {exercise.sets}
                        </div>
                      ) : null}
                      {exercise.reps ? (
                        <div>
                          <span className="text-muted-foreground">Reps:</span>{" "}
                          {exercise.reps}
                        </div>
                      ) : null}
                      {exercise.weight ? (
                        <div>
                          <span className="text-muted-foreground">Weight:</span>{" "}
                          {exercise.weight}kg
                        </div>
                      ) : null}
                      {exercise.duration ? (
                        <div>
                          <span className="text-muted-foreground">
                            Duration:
                          </span>{" "}
                          {exercise.duration}s
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
