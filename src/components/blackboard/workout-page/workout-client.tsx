"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect, useCallback } from "react";
import { Progress } from "@/components/ui/progress";
import { FinishButton } from "@/components/blackboard/blackboard-page/finish-button";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number | null;
  duration: number | null;
  category: string;
  muscles: string[];
  outcomes: string[];
  exercise_id: string;
  workout_id: string;
}

interface WorkoutProps {
  workout: {
    id: string;
    name: string;
    exercises: Exercise[];
    selected: boolean;
    created_at: Date;
  };
}

export function WorkoutClient({ workout }: WorkoutProps) {
  const router = useRouter();
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(3);
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false);

  const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets, 0);
  const completedSets =
    workout.exercises
      .slice(0, currentExercise)
      .reduce((acc, ex) => acc + ex.sets, 0) +
    (currentSet - 1);
  const progress = (completedSets / totalSets) * 100;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isResting && restTime > 0) {
      timer = setTimeout(() => {
        setRestTime((prev) => prev - 1);
      }, 1000);
    } else if (isResting && restTime === 0) {
      setIsResting(false);
      setRestTime(3);
      handleNextSet();
    }
    return () => clearTimeout(timer);
  }, [isResting, restTime]);

  const handleSetComplete = () => {
    setIsResting(true);
  };

  const handleNextSet = useCallback(() => {
    const exercise = workout.exercises[currentExercise];
    if (currentSet < exercise.sets) {
      setCurrentSet((prev) => prev + 1);
    } else if (currentExercise < workout.exercises.length - 1) {
      setCurrentExercise((prev) => prev + 1);
      setCurrentSet(1);
    } else {
      setIsWorkoutComplete(true);
    }
  }, [currentExercise, currentSet, workout.exercises]);

  const exercise = workout.exercises[currentExercise];

  return (
    <div className="min-h-[100dvh] flex flex-col p-4 bg-background">
      <Card className="flex-1 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="text-sm text-muted-foreground">
            {completedSets}/{totalSets} sets completed
          </div>
        </div>
        <div className="mb-4">
          <h1 className="text-2xl font-semibold">{workout.name}</h1>
          <Progress value={progress} className="mt-2" />
        </div>

        <Separator className="my-4" />

        {!isWorkoutComplete ? (
          <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6">
            {isResting ? (
              <div className="space-y-4">
                <h2 className="text-xl font-medium">Rest Time</h2>
                <div className="text-4xl font-bold">{restTime}s</div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <h2 className="text-2xl font-medium">{exercise.name}</h2>
                  <p className="text-muted-foreground">{exercise.category}</p>
                </div>

                <div className="grid grid-cols-2 gap-6 text-lg">
                  <div>
                    <div className="font-medium">Set</div>
                    <div className="text-2xl">
                      {currentSet}/{exercise.sets}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Reps</div>
                    <div className="text-2xl">{exercise.reps}</div>
                  </div>
                  {exercise.weight && (
                    <div>
                      <div className="font-medium">Weight</div>
                      <div className="text-2xl">{exercise.weight}kg</div>
                    </div>
                  )}
                  {exercise.duration && (
                    <div>
                      <div className="font-medium">Duration</div>
                      <div className="text-2xl">{exercise.duration}s</div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                  {exercise.muscles.map((muscle) => (
                    <span
                      key={muscle}
                      className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>

                <Button
                  size="lg"
                  className="w-full max-w-sm mt-8"
                  onClick={handleSetComplete}
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Complete Set
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-sm">
              <FinishButton onClick={() => router.push("/blackboard")} />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
