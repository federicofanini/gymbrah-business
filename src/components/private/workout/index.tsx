"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryState } from "nuqs";
import { ExerciseTable } from "./exercise-table";
import { WorkoutBuilder } from "./workout-builder";
import { YourWorkouts } from "./your-workouts";

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

interface WorkoutPageProps {
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
  workouts: Workout[];
}

export function WorkoutPage({
  exercises,
  initialExercises,
  workouts,
}: WorkoutPageProps) {
  const [tab, setTab] = useQueryState("tab", {
    defaultValue: "your-workouts",
  });

  // Add parse and defaultValue for proper pagination
  const [page, setPage] = useQueryState("page", {
    defaultValue: "1",
    parse: (value) => {
      const parsed = parseInt(value || "1");
      return isNaN(parsed) ? "1" : parsed.toString();
    },
  });

  // Add parse and defaultValue for bodyPart filter
  const [bodyPart, setBodyPart] = useQueryState("bodyPart", {
    defaultValue: "all",
    parse: (value) => value || "all",
  });

  // Add parse and defaultValue for search
  const [searchQuery, setSearchQuery] = useQueryState("search", {
    defaultValue: "",
    parse: (value) => value || "",
  });

  const tabs = [
    {
      id: "your-workouts",
      title: "Your Workouts",
    },
    {
      id: "workout-builder",
      title: "Workout Builder",
    },
    {
      id: "exercise-library",
      title: "Exercise Library",
    },
    {
      id: "assign-workout",
      title: "Assign Workout",
    },
  ];

  return (
    <div className="w-full px-4 md:px-8 py-4">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="justify-start rounded-none h-auto p-0 bg-transparent space-x-4 md:space-x-6 overflow-x-auto">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="rounded-none border-b-2 border-transparent text-primary data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2 text-sm md:text-base whitespace-nowrap"
            >
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="your-workouts" className="mt-6">
          <YourWorkouts workouts={{ success: true, data: workouts }} />
        </TabsContent>

        <TabsContent value="workout-builder" className="mt-6">
          <WorkoutBuilder
            exercises={exercises}
            initialExercises={initialExercises}
          />
        </TabsContent>

        <TabsContent value="exercise-library" className="mt-6">
          <ExerciseTable
            exercises={exercises}
            initialExercises={initialExercises}
          />
        </TabsContent>

        <TabsContent value="assign-workout" className="mt-6"></TabsContent>
      </Tabs>
    </div>
  );
}
