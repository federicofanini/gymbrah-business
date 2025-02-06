"use client";

import { useState } from "react";
import { createWorkout } from "@/actions/workout/create-workout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, SearchIcon, InfoIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { bodyParts } from "@/actions/exercises/bodyParts";
import { useQueryState } from "nuqs";
import { useRouter } from "next/navigation";
import { ExerciseTable } from "./exercise-table";

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
  exerciseId: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
  round?: string;
  exercise?: Exercise;
}

interface WorkoutBuilderProps {
  exercises: {
    exercises: Exercise[];
    pagination: {
      total: number;
      pages: number;
      currentPage: number;
      limit: number;
    };
  };
  initialExercises: Exercise[];
}

export function WorkoutBuilder({
  exercises,
  initialExercises,
}: WorkoutBuilderProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>(
    []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [searchQuery, setSearchQuery] = useQueryState("search", {
    defaultValue: "",
    parse: (value) => value || "",
  });

  const [bodyPart, setBodyPart] = useQueryState("bodyPart", {
    defaultValue: "all",
    parse: (value) => value || "all",
  });

  const [page, setPage] = useQueryState("page", {
    defaultValue: "1",
    parse: (value) => {
      const parsed = parseInt(value || "1");
      return isNaN(parsed) ? "1" : parsed.toString();
    },
  });

  const handleBodyPartChange = async (value: string) => {
    await setBodyPart(value);
    await setPage("1");
    router.refresh();
  };

  const handleSearch = async (value: string) => {
    await setSearchQuery(value);
    await setPage("1");
    router.refresh();
  };

  const addExerciseToWorkout = (exercise: Exercise) => {
    setWorkoutExercises([
      ...workoutExercises,
      {
        exerciseId: exercise.id,
        exercise: exercise,
      },
    ]);
  };

  const updateWorkoutExercise = (
    index: number,
    field: keyof WorkoutExercise,
    value: string | number
  ) => {
    const updatedExercises = [...workoutExercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: field === "exerciseId" ? value : Number(value),
    };
    setWorkoutExercises(updatedExercises);
  };

  const removeWorkoutExercise = (index: number) => {
    setWorkoutExercises(workoutExercises.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      toast.error("Please enter a workout name");
      return;
    }

    if (workoutExercises.length === 0) {
      toast.error("Please add at least one exercise");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createWorkout({
        name,
        exercises: workoutExercises,
      });

      if (result?.data?.success) {
        toast.success("Workout created successfully");
        setName("");
        setWorkoutExercises([]);
        router.refresh();
      } else {
        toast.error("Failed to create workout");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayedExercises =
    bodyPart === "all" ? initialExercises : exercises?.exercises || [];

  const filteredExercises =
    displayedExercises?.filter((exercise) => {
      if (!exercise) return false;

      const matchesSearch =
        !searchQuery ||
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.body_part.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    }) || [];

  return (
    <div className="space-y-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create New Workout</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Workout Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {workoutExercises.length > 0 && (
              <div className="space-y-4">
                <Label>Selected Exercises</Label>
                {workoutExercises.map((workoutExercise, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1 space-y-2">
                      <div className="font-medium">
                        {workoutExercise.exercise?.name}
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <Input
                          type="number"
                          placeholder="Sets"
                          value={workoutExercise.sets || ""}
                          onChange={(e) =>
                            updateWorkoutExercise(index, "sets", e.target.value)
                          }
                        />
                        <Input
                          type="number"
                          placeholder="Reps"
                          value={workoutExercise.reps || ""}
                          onChange={(e) =>
                            updateWorkoutExercise(index, "reps", e.target.value)
                          }
                        />
                        <Input
                          type="number"
                          placeholder="Weight"
                          value={workoutExercise.weight || ""}
                          onChange={(e) =>
                            updateWorkoutExercise(
                              index,
                              "weight",
                              e.target.value
                            )
                          }
                        />
                        <Input
                          type="number"
                          placeholder="Duration"
                          value={workoutExercise.duration || ""}
                          onChange={(e) =>
                            updateWorkoutExercise(
                              index,
                              "duration",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeWorkoutExercise(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || !name || workoutExercises.length === 0}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Workout"
              )}
            </Button>

            <ExerciseTable
              exercises={exercises}
              initialExercises={initialExercises}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
