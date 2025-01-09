"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dumbbell, Flame, Snowflake } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect, useState } from "react";
import { getSelectedWorkout } from "@/actions/workout/get-workouts";
import { toast } from "sonner";
import { categories } from "./workout/create-workout/exercises/exercises-list";
import { Skeleton } from "@/components/ui/skeleton";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  duration?: number | null;
  category: string;
  isCompleted?: boolean;
}

interface WorkoutSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  exercises: Exercise[];
}

export function DailyWorkout() {
  const [sections, setSections] = useState<WorkoutSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkout() {
      try {
        const response = await getSelectedWorkout();
        if (response.success && response.data) {
          // Group exercises by category
          const warmupExercises = response.data.exercises.filter(
            (e: Exercise) => e.category === categories.warmUp
          );
          const cooldownExercises = response.data.exercises.filter(
            (e: Exercise) => e.category === categories.flexibilityMobility
          );
          const workoutExercises = response.data.exercises.filter(
            (e: Exercise) =>
              ![categories.warmUp, categories.flexibilityMobility].includes(
                e.category
              )
          );

          // Create sections with exercises
          const formattedSections = [
            {
              id: "warmup",
              title: "Warm Up",
              icon: <Flame className="h-4 w-4 text-orange-500" />,
              exercises: warmupExercises.map((e: Exercise) => ({
                ...e,
                isCompleted: false,
              })),
            },
            {
              id: "workout",
              title: "Workout",
              icon: <Dumbbell className="h-4 w-4" />,
              exercises: workoutExercises.map((e: Exercise) => ({
                ...e,
                isCompleted: false,
              })),
            },
            {
              id: "cooldown",
              title: "Flexibility & Mobility",
              icon: <Snowflake className="h-4 w-4 text-cyan-500" />,
              exercises: cooldownExercises.map((e: Exercise) => ({
                ...e,
                isCompleted: false,
              })),
            },
          ].filter((section) => section.exercises.length > 0);

          setSections(formattedSections);
        }
      } catch (error) {
        console.error("Error fetching workout:", error);
        toast.error("Failed to fetch workout");
      } finally {
        setIsLoading(false);
      }
    }

    fetchWorkout();
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleCheck = (sectionId: string, exerciseId: string) => {
    setSections((prevSections) => {
      return prevSections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            exercises: section.exercises.map((exercise) => {
              if (exercise.id === exerciseId) {
                if (!exercise.isCompleted) {
                  triggerConfetti();
                }
                return { ...exercise, isCompleted: !exercise.isCompleted };
              }
              return exercise;
            }),
          };
        }
        return section;
      });
    });
  };

  if (isLoading) {
    return (
      <Card className="w-full p-4">
        <div className="space-y-6">
          {[1, 2, 3].map((section) => (
            <div key={section} className="space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="pl-6 space-y-4">
                {[1, 2, 3].map((exercise) => (
                  <div key={exercise} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

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
                {section.exercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={exercise.id}
                      checked={exercise.isCompleted}
                      onCheckedChange={() =>
                        handleCheck(section.id, exercise.id)
                      }
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
