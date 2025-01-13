import { Card } from "@/components/ui/card";
import { getCachedWorkoutsByDay } from "@/actions/workout/cached-workout";
import { WorkoutClient } from "@/components/blackboard/workout-page/workout-client";
import { getUser } from "@/utils/supabase/database/cached-queries";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number | null;
  duration: number | null;
  category: string;
  bodyPart: string | null;
  equipment: string | null;
  target: string | null;
  secondaryMuscles: string[];
  instructions: string[];
  gifUrl: string | null;
  exercise_id: string;
  workout_id: string;
  round: string;
}

interface Workout {
  id: string;
  name: string;
  selected: boolean;
  created_at: Date;
  exercises: Exercise[];
}

// Define the type for the dynamic route params
type PageParams = { idWorkout: string } & Promise<any>;

export default async function WorkoutPage({ params }: { params: PageParams }) {
  const [workoutsResponse, user] = await Promise.all([
    getCachedWorkoutsByDay(),
    getUser(),
  ]);

  if (!user) {
    return (
      <div className="container max-w-2xl mx-auto p-4">
        <Card className="p-6">
          <div className="text-center">
            <h1 className="text-xl font-semibold">Not authenticated</h1>
            <p className="text-muted-foreground">
              Please sign in to view this workout
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (!workoutsResponse.success || !workoutsResponse.data) {
    return (
      <div className="container max-w-2xl mx-auto p-4">
        <Card className="p-6">
          <div className="text-center">
            <h1 className="text-xl font-semibold">Error loading workout</h1>
            <p className="text-muted-foreground">Please try again later</p>
          </div>
        </Card>
      </div>
    );
  }

  const workoutsByDay = workoutsResponse.data;

  // Find workout by ID from workoutsByDay
  const workout = Object.values(workoutsByDay).find(
    (w) => w !== null && (w as Workout)?.id === params.idWorkout
  ) as Workout | undefined;

  if (!workout) {
    return (
      <div className="container max-w-2xl mx-auto p-4">
        <Card className="p-6">
          <div className="text-center">
            <h1 className="text-xl font-semibold">Workout not found</h1>
            <p className="text-muted-foreground">
              The requested workout could not be found
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return <WorkoutClient workout={workout} userId={user.id} />;
}
