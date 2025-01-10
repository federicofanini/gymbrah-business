import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Dumbbell, Flame, Snowflake } from "lucide-react";
import { categories } from "../workout/create-workout/exercises/exercises-list";
import { ExerciseCheckbox } from "./exercise-checkbox";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  duration?: number | null;
  category: string;
}

interface Workout {
  id: string;
  name: string;
  created_at: Date;
  exercises: Exercise[];
  selected: boolean;
  frequency: string;
}

interface WorkoutSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  exercises: Exercise[];
}

export async function DailyWorkout({ workoutData }: { workoutData?: Workout }) {
  if (!workoutData) {
    return null;
  }

  // Group exercises by category
  const warmupExercises = workoutData.exercises.filter(
    (e: Exercise) => e.category === categories.warmUp
  );
  const cooldownExercises = workoutData.exercises.filter(
    (e: Exercise) => e.category === categories.flexibilityMobility
  );
  const workoutExercises = workoutData.exercises.filter(
    (e: Exercise) =>
      ![categories.warmUp, categories.flexibilityMobility].includes(e.category)
  );

  // Create sections with exercises
  const sections = [
    {
      id: "warmup",
      title: "Warm Up",
      icon: <Flame className="h-4 w-4 text-orange-500" />,
      exercises: warmupExercises,
    },
    {
      id: "workout",
      title: "Workout",
      icon: <Dumbbell className="h-4 w-4" />,
      exercises: workoutExercises,
    },
    {
      id: "cooldown",
      title: "Flexibility & Mobility",
      icon: <Snowflake className="h-4 w-4 text-cyan-500" />,
      exercises: cooldownExercises,
    },
  ].filter((section) => section.exercises.length > 0);

  if (sections.length === 0) {
    return null;
  }

  return (
    <Card className="w-full p-4">
      <Accordion type="single" collapsible className="w-full">
        {sections.map((section) => (
          <AccordionItem
            key={section.id}
            value={section.id}
            className="border-none"
          >
            <AccordionTrigger className="flex items-center gap-2">
              {section.icon}
              <span>{section.title}</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4 pl-6">
                {section.exercises.map((exercise: Exercise) => (
                  <div
                    key={exercise.id}
                    className="flex items-center space-x-2"
                  >
                    <ExerciseCheckbox
                      sectionId={section.id}
                      exercise={exercise}
                    />
                    <label
                      htmlFor={exercise.id}
                      className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {exercise.name}{" "}
                      <Badge variant="secondary">
                        {exercise.sets && exercise.reps
                          ? `${exercise.sets} sets x ${exercise.reps} reps`
                          : exercise.duration
                          ? `${exercise.duration} min`
                          : null}
                      </Badge>
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
}
