"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryState } from "nuqs";
import { ExerciseTable } from "./exercise-table";
import { WorkoutBuilder } from "./workout-builder";
import { YourWorkouts } from "./your-workouts";
import { AssignWorkout } from "./assign-workout";
import { AssignedWorkout } from "./assigned-workout";

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

interface Athlete {
  id: string;
  full_name: string;
  goal: string;
  gender_age: string;
  status: string;
}

interface PaginatedResponse {
  total: number;
  pages: number;
  currentPage: number;
  limit: number;
}

interface AssignedWorkout {
  id: string;
  workout: {
    id: string;
    name: string;
    exercises: {
      exercise: {
        id: string;
        name: string;
      };
    }[];
  };
  athlete_id: string;
}

interface WorkoutPageProps {
  exercises: {
    exercises: Exercise[];
    pagination: PaginatedResponse;
  };
  initialExercises: Exercise[];
  workouts: Workout[];
  athletes: {
    athletes: Athlete[];
    pagination: PaginatedResponse;
  };
  assignedWorkouts: AssignedWorkout[];
}

export function WorkoutPage({
  exercises,
  initialExercises,
  workouts,
  athletes,
  assignedWorkouts,
}: WorkoutPageProps) {
  const [tab, setTab] = useQueryState("tab", {
    defaultValue: "your-workouts",
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

        <TabsContent value="assign-workout" className="mt-6">
          <AssignWorkout
            athletes={{
              athletes: athletes.athletes,
              pagination: athletes.pagination,
            }}
            workouts={{
              workouts: workouts,
              pagination: {
                total: workouts.length,
                pages: 1,
                currentPage: 1,
                limit: workouts.length,
              },
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
