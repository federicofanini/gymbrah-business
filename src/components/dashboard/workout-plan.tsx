"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Dumbbell } from "lucide-react";
import confetti from "canvas-confetti";

export function WorkoutPlan() {
  const [exercises, setExercises] = useState({
    pushups: false,
    pullups: false,
    chinups: false,
    situps: false,
  });

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleCheck = (exercise: keyof typeof exercises) => {
    setExercises((prev) => {
      const newState = { ...prev, [exercise]: !prev[exercise] };

      if (newState[exercise]) {
        triggerConfetti();
      }

      return newState;
    });
  };

  return (
    <Card className="w-full md:w-1/3">
      <CardHeader>
        <CardTitle className="text-lg">Daily Workout Plan</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="pushups"
            checked={exercises.pushups}
            onCheckedChange={() => handleCheck("pushups")}
          />
          <label
            htmlFor="pushups"
            className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <Dumbbell className="h-4 w-4" />
            80 Push-ups
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="pullups"
            checked={exercises.pullups}
            onCheckedChange={() => handleCheck("pullups")}
          />
          <label
            htmlFor="pullups"
            className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <Dumbbell className="h-4 w-4" />
            80 Pull-ups
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="chinups"
            checked={exercises.chinups}
            onCheckedChange={() => handleCheck("chinups")}
          />
          <label
            htmlFor="chinups"
            className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <Dumbbell className="h-4 w-4" />
            80 Chin-ups
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="situps"
            checked={exercises.situps}
            onCheckedChange={() => handleCheck("situps")}
          />
          <label
            htmlFor="situps"
            className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <Dumbbell className="h-4 w-4" />
            120 Russian Sit-ups
          </label>
        </div>
      </CardContent>
    </Card>
  );
}
