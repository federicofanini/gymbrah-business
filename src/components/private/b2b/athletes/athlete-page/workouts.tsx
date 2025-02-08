"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import { AssignDialog } from "./assign-dialog";

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
    </div>
  );
}
