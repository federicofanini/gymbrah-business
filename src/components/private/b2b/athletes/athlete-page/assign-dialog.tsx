"use client";

import { useState, useEffect } from "react";
import { assignWorkout } from "@/actions/workout/assign-workout";
import { getWorkout } from "@/actions/workout/get-workout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getBusinessId } from "@/actions/business/business-id";

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

interface Workout {
  id: string;
  name: string;
  created_at: string;
  exercises: WorkoutExercise[];
}

interface AssignDialogProps {
  athleteId: string;
}

export function AssignDialog({ athleteId }: AssignDialogProps) {
  const router = useRouter();
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [workoutSearch, setWorkoutSearch] = useQueryState("workoutSearch", {
    defaultValue: "",
    parse: (value) => value || "",
  });

  useEffect(() => {
    async function fetchWorkouts() {
      try {
        const businessIdResult = await getBusinessId();

        if (!businessIdResult?.data?.success || !businessIdResult?.data?.data) {
          toast.error("Failed to get business ID");
          return;
        }

        const result = await getWorkout({
          businessId: businessIdResult.data.data,
        });

        if (result?.data?.success) {
          setWorkouts(result.data.data);
        } else {
          toast.error("Failed to load workouts");
        }
      } catch (error) {
        toast.error("An error occurred while loading workouts");
      } finally {
        setIsLoading(false);
      }
    }

    if (isOpen) {
      fetchWorkouts();
    }
  }, [isOpen]);

  const handleAssignWorkout = async () => {
    if (!selectedWorkout) {
      toast.error("Please select a workout");
      return;
    }

    setIsSubmitting(true);

    try {
      const businessIdResult = await getBusinessId();

      if (!businessIdResult?.data?.success || !businessIdResult?.data?.data) {
        toast.error("Failed to get business ID");
        return;
      }

      const result = await assignWorkout({
        athleteId,
        workoutId: selectedWorkout,
        businessId: businessIdResult.data.data,
      });

      if (result?.data?.success) {
        toast.success("Workout assigned successfully");
        setSelectedWorkout(null);
        setIsOpen(false);
        router.refresh();
      } else {
        toast.error("Failed to assign workout");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredWorkouts = workouts.filter((workout) =>
    workout.name.toLowerCase().includes((workoutSearch || "").toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 size-4" />
          Assign Workout
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Assign Workout</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Input
            placeholder="Search workouts..."
            value={workoutSearch}
            onChange={(e) => setWorkoutSearch(e.target.value)}
          />

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Workout Name</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Exercises</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : filteredWorkouts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground"
                  >
                    No workouts found
                  </TableCell>
                </TableRow>
              ) : (
                filteredWorkouts.map((workout) => (
                  <TableRow key={workout.id}>
                    <TableCell className="font-medium">
                      {workout.name}
                    </TableCell>
                    <TableCell>
                      {new Date(workout.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {workout.exercises?.length || 0} exercises
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={
                          selectedWorkout === workout.id ? "default" : "outline"
                        }
                        onClick={() => setSelectedWorkout(workout.id)}
                      >
                        {selectedWorkout === workout.id ? "Selected" : "Select"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <Button
            onClick={handleAssignWorkout}
            disabled={isSubmitting || !selectedWorkout}
            className="w-full mt-4"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Assigning...
              </>
            ) : (
              "Assign Workout"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
