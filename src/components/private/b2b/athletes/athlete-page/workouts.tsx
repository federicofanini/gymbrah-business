"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import { useQueryState } from "nuqs";

interface Workout {
  id: string;
  name: string;
  date: string;
  status: "completed" | "scheduled" | "missed";
  type: string;
  duration: number;
}

interface WorkoutsTabProps {
  workouts: Workout[];
}

export function WorkoutsTab({ workouts }: WorkoutsTabProps) {
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
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 size-4" />
          Assign Workout
        </Button>
      </div>

      <div className="grid gap-3 md:gap-4">
        {workouts.map((workout) => (
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
        ))}
      </div>
    </div>
  );
}
