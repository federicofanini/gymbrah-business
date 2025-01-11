"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect, useCallback } from "react";
import { Progress } from "@/components/ui/progress";
import { FinishButton } from "@/components/blackboard/blackboard-page/finish-button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { saveCompletedReps } from "@/actions/workout-page/reps-completed";
import { toast } from "sonner";
import { WorkoutStats } from "./workout-stats";

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
  userId: string;
  workout: {
    id: string;
    name: string;
    exercises: Exercise[];
    selected: boolean;
    created_at: Date;
  };
}

export function WorkoutClient({ workout, userId }: WorkoutProps) {
  const router = useRouter();
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(60);
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false);
  const [completedReps, setCompletedReps] = useState<number>(0);

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
      setRestTime(60);
      handleNextSet();
    }
    return () => clearTimeout(timer);
  }, [isResting, restTime]);

  const handleSetComplete = async () => {
    if (completedReps === 0) {
      toast.error("Please enter completed reps");
      return;
    }

    const exercise = workout.exercises[currentExercise];
    const result = await saveCompletedReps({
      workoutExerciseId: exercise.id,
      userId: userId,
      completedReps,
      setNumber: currentSet,
    });

    if (result?.data?.success) {
      setIsResting(true);
    } else {
      toast.error("Error saving completed reps", {
        description: result?.data?.error,
      });
    }
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
    setCompletedReps(0);
  }, [currentExercise, currentSet, workout.exercises]);

  const exercise = workout.exercises[currentExercise];

  return (
    <div className="min-h-[80dvh] flex flex-col p-2 sm:p-4 md:p-6 bg-background">
      <Card className="flex-1 p-4 sm:p-6 md:p-8 flex flex-col">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold">{workout.name}</h1>
            <Button variant="secondary" onClick={() => router.back()}>
              Exit
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Progress value={progress} className="w-full sm:w-32" />
            <span className="whitespace-nowrap">{Math.round(progress)}%</span>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Main Content */}
        {!isWorkoutComplete ? (
          <div className="flex-1 flex flex-col">
            {/* Exercise Progress */}
            <div className="mb-6 flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Exercise {currentExercise + 1}/{workout.exercises.length}
              </span>
              <span>
                {completedSets}/{totalSets} sets completed
              </span>
            </div>

            {isResting ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-medium">Rest Time</h2>
                  <div className="text-6xl font-bold text-primary">
                    {restTime}s
                  </div>
                  <p className="text-muted-foreground">
                    Get ready for your next set!
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 grid md:grid-cols-2 gap-8 items-center">
                {/* Exercise Info */}
                <div className="space-y-8">
                  <div className="space-y-3">
                    <h2 className="text-3xl font-bold">{exercise.name}</h2>
                    <div className="flex flex-wrap gap-2">
                      <p className="text-lg text-muted-foreground">
                        {exercise.category}
                      </p>
                      {exercise.muscles.map((muscle) => (
                        <Badge
                          key={muscle}
                          className="text-md"
                          variant="secondary"
                        >
                          {muscle}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-secondary/50 p-4 rounded-lg text-center">
                      <div className="text-sm font-medium mb-1">Set</div>
                      <div className="text-3xl font-bold">
                        {currentSet}/{exercise.sets}
                      </div>
                    </div>
                    <div className="bg-secondary/50 p-4 rounded-lg text-center">
                      <div className="text-sm font-medium mb-1">
                        Target Reps
                      </div>
                      <div className="text-3xl font-bold">{exercise.reps}</div>
                    </div>
                    {exercise.weight && (
                      <div className="bg-secondary/50 p-4 rounded-lg text-center">
                        <div className="text-sm font-medium mb-1">Weight</div>
                        <div className="text-3xl font-bold">
                          {exercise.weight}kg
                        </div>
                      </div>
                    )}
                    {exercise.duration && (
                      <div className="bg-secondary/50 p-4 rounded-lg text-center">
                        <div className="text-sm font-medium mb-1">Duration</div>
                        <div className="text-3xl font-bold">
                          {exercise.duration}s
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="text-sm font-medium mb-2 block">
                          Completed Reps
                        </label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={completedReps || ""}
                            onChange={(e) =>
                              setCompletedReps(Number(e.target.value))
                            }
                            className="text-lg h-12"
                            placeholder="Reps completed"
                          />
                        </div>
                      </div>
                    </div>
                    <Button
                      size="lg"
                      className="w-full text-lg h-16"
                      onClick={handleSetComplete}
                    >
                      <CheckCircle className="h-6 w-6 mr-2" />
                      Complete Set
                      <ChevronRight className="h-5 w-5 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-md space-y-6 text-center">
              <h2 className="text-3xl font-bold">Workout Complete!</h2>
              <p className="text-muted-foreground">
                Great job! You&apos;ve completed all exercises.
              </p>
              <WorkoutStats workoutId={workout.id} userId={userId} />
              <FinishButton
                onClick={() => router.push("/blackboard")}
                userId={userId}
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
