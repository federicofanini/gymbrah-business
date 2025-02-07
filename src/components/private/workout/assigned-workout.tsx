"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryState } from "nuqs";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface Exercise {
  exercise: {
    id: string;
    name: string;
  };
}

interface Workout {
  id: string;
  workout: {
    id: string;
    name: string;
    exercises: Exercise[];
  };
  athlete_id: string;
}

interface AssignedWorkoutProps {
  assignedWorkouts?: Workout[];
}

export function AssignedWorkout({
  assignedWorkouts = [],
}: AssignedWorkoutProps) {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  const [search, setSearch] = useQueryState("assignedSearch", {
    defaultValue: "",
    parse: (value) => value || "",
  });

  const handleRemoveWorkout = async (workoutId: string, athleteId: string) => {
    setIsRemoving(workoutId);

    try {
      // Mock removal logic for now
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Workout removed successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to remove workout");
    } finally {
      setIsRemoving(null);
    }
  };

  const filteredWorkouts = assignedWorkouts.filter((assigned) =>
    assigned.workout.name.toLowerCase().includes((search || "").toLowerCase())
  );

  return (
    <div className="space-y-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Assigned Workouts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Search assigned workouts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Workout Name</TableHead>
                  <TableHead>Exercises</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkouts.map((assigned) => (
                  <TableRow key={assigned.id}>
                    <TableCell>{assigned.workout.name}</TableCell>
                    <TableCell>
                      {assigned.workout.exercises.length} exercises
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          handleRemoveWorkout(assigned.id, assigned.athlete_id)
                        }
                        disabled={isRemoving === assigned.id}
                      >
                        {isRemoving === assigned.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
