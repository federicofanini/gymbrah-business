import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number | null;
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

export async function WorkoutSummary({
  workoutData,
}: {
  workoutData?: Workout;
}) {
  if (!workoutData) {
    return null;
  }

  // Include all exercises
  const exercises = workoutData.exercises;

  if (exercises.length === 0) {
    return null;
  }

  return (
    <Card className="w-full p-6 bg-gradient-to-br from-background to-muted/50">
      <CardContent>
        <div className="flex items-center gap-2 mb-6">
          <Dumbbell className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">
            Workout ({exercises.length} exercises)
          </h3>
        </div>

        <div className="space-y-4">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="p-4 rounded-lg bg-card/50 border border-border/50 hover:border-primary/20 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-base">{exercise.name}</h4>
                <div className="flex gap-2">
                  {exercise.sets && exercise.reps && (
                    <Badge variant="secondary" className="font-mono">
                      {exercise.sets} × {exercise.reps}
                      {exercise.weight ? ` @ ${exercise.weight}kg` : ""}
                    </Badge>
                  )}
                  {exercise.duration && (
                    <Badge variant="secondary" className="font-mono">
                      {exercise.duration} sec
                    </Badge>
                  )}
                </div>
              </div>

              {/*<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Array.from({ length: exercise.sets }).map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-md",
                      "bg-background/50 hover:bg-background/80 transition-colors",
                      "border border-border/50"
                    )}
                  >
                    <Checkbox
                      id={`set-${exercise.id}-${index}`}
                      className="data-[state=checked]:bg-primary"
                    />
                    <span className="text-sm text-muted-foreground">
                      Set {index + 1}
                    </span>
                  </div>
                ))}
              </div>*/}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
