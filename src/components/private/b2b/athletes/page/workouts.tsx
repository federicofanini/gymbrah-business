"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const mockWorkouts: Workout[] = [
  {
    id: "1",
    name: "Upper Body Strength",
    date: "2024-01-20",
    status: "scheduled",
    type: "Strength",
    duration: 60,
  },
  {
    id: "2",
    name: "Lower Body Power",
    date: "2024-01-18",
    status: "completed",
    type: "Power",
    duration: 45,
  },
  {
    id: "3",
    name: "Core & Mobility",
    date: "2024-01-15",
    status: "completed",
    type: "Mobility",
    duration: 30,
  },
  {
    id: "4",
    name: "Full Body HIIT",
    date: "2024-01-12",
    status: "missed",
    type: "Conditioning",
    duration: 45,
  },
];

export function WorkoutsTab() {
  const [view] = useQueryState("view", {
    defaultValue: "upcoming",
  });

  const statusVariant = {
    completed: "success",
    scheduled: "secondary",
    missed: "destructive",
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Workouts</h2>
        <Button>
          <Plus className="mr-2 size-4" />
          Assign Workout
        </Button>
      </div>

      <div className="grid gap-4">
        {mockWorkouts.map((workout) => (
          <Card key={workout.id}>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-6">
                <Calendar className="size-8 text-muted-foreground" />
                <div>
                  <h3 className="font-semibold">{workout.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{workout.type}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(workout.date).toLocaleDateString()} •{" "}
                      {workout.duration} min
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline">
                  {workout.status.charAt(0).toUpperCase() +
                    workout.status.slice(1)}
                </Badge>
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
