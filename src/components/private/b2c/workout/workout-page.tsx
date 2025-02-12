"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ChevronLeft, ChevronRight, SkipForward, Timer } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Exercise {
  id: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
  round?: string;
  exercise: {
    id: string;
    name: string;
    body_part: string;
    equipment: string;
    target: string;
    gif_url: string;
    secondary_muscles: string[];
  };
}

interface WorkoutPageProps {
  exercises: Exercise[];
}

export function WorkoutPage({ exercises }: WorkoutPageProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [restTime, setRestTime] = useState(60);
  const [isResting, setIsResting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const currentExercise = exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === exercises.length - 1;
  const isFirstExercise = currentExerciseIndex === 0;

  function handleNext() {
    if (!isLastExercise) {
      setCurrentExerciseIndex((prev) => prev + 1);
      setIsResting(false);
    }
  }

  function handlePrevious() {
    if (!isFirstExercise) {
      setCurrentExerciseIndex((prev) => prev - 1);
      setIsResting(false);
    }
  }

  function startTimer() {
    setTimeLeft(restTime);
    setIsResting(true);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsResting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  if (!exercises.length) {
    return (
      <Card className="w-full h-[calc(100vh-130px)] border-none">
        <CardContent className="p-6 text-center">
          <p className="text-lg font-medium">No exercises found</p>
        </CardContent>
      </Card>
    );
  }

  if (isResting) {
    return (
      <div className="h-[calc(100vh-130px)] w-full p-4 flex flex-col">
        <Card className="flex-1 flex flex-col items-center justify-center border-none">
          <h2 className="text-6xl font-bold mb-8">Rest Time</h2>
          <p className="text-8xl font-bold mb-12">{timeLeft}s</p>
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsResting(false)}
              className="flex gap-2"
            >
              <SkipForward className="w-4 h-4" />
              Skip Rest
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-130px)] w-full p-4 flex flex-col">
      <Card className="flex-1 flex flex-col border-none">
        <CardHeader className="flex-none">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">
              {currentExercise.exercise.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              Exercise {currentExerciseIndex + 1} of {exercises.length}
            </p>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col lg:flex-row gap-6 overflow-y-auto">
          <div className="lg:w-1/2 flex flex-col justify-center">
            <img
              src={currentExercise.exercise.gif_url}
              alt={currentExercise.exercise.name}
              className="w-full max-w-md mx-auto rounded-lg"
            />
          </div>

          <div className="lg:w-1/2 flex flex-col gap-6">
            <div className="p-6 rounded-xl border border-border">
              <div className="grid grid-cols-2 gap-y-6 text-lg">
                {currentExercise.sets && (
                  <div className="col-span-1">
                    <p className="font-bold text-primary">Sets</p>
                    <p className="text-2xl">{currentExercise.sets}</p>
                  </div>
                )}
                {currentExercise.reps && (
                  <div className="col-span-1">
                    <p className="font-bold text-primary">Reps</p>
                    <p className="text-2xl">{currentExercise.reps}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Equipment</p>
                  <p className="capitalize">
                    {currentExercise.exercise.equipment}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Target Muscle</p>
                  <p className="capitalize">
                    {currentExercise.exercise.target}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Body Part</p>
                  <p className="capitalize">
                    {currentExercise.exercise.body_part}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Secondary Muscles
                  </p>
                  <p className="capitalize">
                    {currentExercise.exercise.secondary_muscles.join(", ")}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-auto">
              <Input
                type="number"
                value={restTime}
                onChange={(e) => setRestTime(Number(e.target.value))}
                className="text-8xl h-20 text-center font-bold"
                placeholder="Rest time in seconds"
              />
              <Button
                onClick={startTimer}
                className="h-20 text-4xl font-bold"
                size="lg"
              >
                <Timer className="size-20 mr-4" />
                Start Rest
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-none flex justify-between mt-auto border-t pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={isFirstExercise}
            className="w-[160px] h-12 text-lg"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={isLastExercise}
            className="w-[160px] h-12 text-lg"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
