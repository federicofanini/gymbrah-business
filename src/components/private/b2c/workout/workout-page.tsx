"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ChevronLeft, ChevronRight, SkipForward, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const currentExercise = exercises[currentExerciseIndex];
  const totalSets = currentExercise.sets || 1;
  const isLastExercise = currentExerciseIndex === exercises.length - 1;
  const isFirstExercise = currentExerciseIndex === 0;
  const isLastSet = currentSet === totalSets;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isResting) {
      const startTime = Date.now();
      timer = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        setTimeLeft(elapsedSeconds);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isResting]);

  function handleNext() {
    if (isLastSet) {
      if (!isLastExercise) {
        setCurrentExerciseIndex((prev) => prev + 1);
        setCurrentSet(1);
      }
    } else {
      setCurrentSet((prev) => prev + 1);
    }
    startTimer();
  }

  function handlePrevious() {
    if (currentSet === 1) {
      if (!isFirstExercise) {
        setCurrentExerciseIndex((prev) => prev - 1);
        setCurrentSet(exercises[currentExerciseIndex - 1].sets || 1);
      }
    } else {
      setCurrentSet((prev) => prev - 1);
    }
    setIsResting(false);
  }

  function startTimer() {
    setTimeLeft(0);
    setIsResting(true);
  }

  if (!exercises.length) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <Card className="w-full max-w-md m-4">
          <CardContent className="p-6 text-center">
            <p className="text-lg font-medium">No exercises found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isResting) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-[100]">
        <div className="relative z-50 flex flex-col items-center w-full max-w-xl mx-4">
          <h3 className="text-xl mb-2">{currentExercise.exercise.name}</h3>
          <p className="text-muted-foreground mb-6">
            {isLastSet
              ? "Next exercise coming up!"
              : `Get ready for set ${currentSet + 1}/${totalSets}`}
          </p>
          <p className="text-8xl font-bold mb-8">{timeLeft}s</p>
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
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-[100]">
      <div className="h-full max-h-screen overflow-hidden flex flex-col">
        <Card className="flex-1 flex flex-col border-none bg-white">
          <CardHeader className="flex-none">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {currentExercise.exercise.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                Exercise {currentExerciseIndex + 1}/{exercises.length}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="destructive" size="sm">
                  <Link href="/athlete">Exit</Link>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent
            className={cn("flex-1 grid gap-4", "lg:grid-cols-2 lg:gap-6")}
          >
            <div className="flex flex-col justify-center">
              <img
                src={currentExercise.exercise.gif_url}
                alt={currentExercise.exercise.name}
                className="w-full max-w-md mx-auto rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-border text-sm">
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

              <div className="grid grid-cols-2 gap-4">
                {currentExercise.sets && (
                  <div className="text-center p-3 rounded-xl border border-border">
                    <p className="text-sm text-muted-foreground">Sets</p>
                    <p className="text-2xl font-bold">
                      {currentExercise.sets} / {totalSets}
                    </p>
                  </div>
                )}
                {currentExercise.reps && (
                  <div className="text-center p-3 rounded-xl border border-border">
                    <p className="text-sm text-muted-foreground">Reps</p>
                    <p className="text-2xl font-bold">{currentExercise.reps}</p>
                  </div>
                )}
                {currentExercise.weight && (
                  <div className="text-center p-3 rounded-xl border border-border">
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p className="text-2xl font-bold">
                      {currentExercise.weight}
                    </p>
                  </div>
                )}
                {currentExercise.duration && (
                  <div className="text-center p-3 rounded-xl border border-border">
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="text-2xl font-bold">
                      {currentExercise.duration}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex-none flex justify-between mt-auto pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstExercise && currentSet === 1}
              className="w-[120px] h-12"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={isLastExercise && isLastSet}
              className="w-[120px] h-12"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
