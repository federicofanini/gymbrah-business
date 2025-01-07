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
import { useState } from "react";

interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: number;
  duration?: string;
  isCompleted: boolean;
}

interface WorkoutSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  exercises: Exercise[];
}

const mockWorkoutSections: WorkoutSection[] = [
  {
    id: "warmup",
    title: "Warm Up",
    icon: <Flame className="h-4 w-4 text-orange-500" />,
    exercises: [
      {
        id: "wu1",
        name: "Dynamic Stretching",
        duration: "5 min",
        isCompleted: false,
      },
      {
        id: "wu2",
        name: "Jumping Jacks",
        sets: 2,
        reps: 20,
        isCompleted: false,
      },
    ],
  },
  {
    id: "workout",
    title: "Main Workout",
    icon: <Dumbbell className="h-4 w-4 text-muted-foreground" />,
    exercises: [
      {
        id: "w1",
        name: "Push-ups",
        sets: 3,
        reps: 12,
        isCompleted: false,
      },
      {
        id: "w2",
        name: "Squats",
        sets: 4,
        reps: 15,
        isCompleted: false,
      },
      {
        id: "w3",
        name: "Plank",
        duration: "45 sec",
        isCompleted: false,
      },
    ],
  },
  {
    id: "cooldown",
    title: "Cool Down",
    icon: <Snowflake className="h-4 w-4 text-cyan-500" />,
    exercises: [
      {
        id: "cd1",
        name: "Static Stretching",
        duration: "5 min",
        isCompleted: false,
      },
      {
        id: "cd2",
        name: "Deep Breathing",
        duration: "2 min",
        isCompleted: false,
      },
    ],
  },
];

export function DailyWorkout() {
  const [sections, setSections] = useState(mockWorkoutSections);

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
                          : exercise.duration}
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
