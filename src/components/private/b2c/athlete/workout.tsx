import { getBusinessNameById } from "@/actions/business/get-business-name-by-id";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { Dumbbell, PlayCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

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
    instructions: string[];
  };
}

interface Workout {
  id: string;
  name: string;
  created_at: string;
  exercises: Exercise[];
  business_id?: string;
  assigned_at?: string;
}

interface WorkoutCarouselProps {
  workouts: Workout[];
  businessName: string;
}

async function BusinessNameHeader({ businessId }: { businessId: string }) {
  const response = await getBusinessNameById({
    businessId,
  });
  return (
    <h2 className="text-2xl font-semibold mb-4">
      Workouts from {response?.data?.data}
    </h2>
  );
}
export async function WorkoutCarousel({
  workouts,
  businessName,
}: WorkoutCarouselProps) {
  if (!workouts.length) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <Dumbbell className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-lg font-medium">No workouts found</p>
          <p className="text-sm text-muted-foreground">
            You don&apos;t have any workouts assigned yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full">
      <Suspense
        fallback={
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
          </div>
        }
      >
        <BusinessNameHeader businessId={workouts[0]?.business_id || ""} />
      </Suspense>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {workouts.map((workout) => (
            <CarouselItem
              key={workout.id}
              className="md:basis-1/2 lg:basis-1/3"
            >
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">{workout.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Assigned:{" "}
                    {new Date(
                      workout.assigned_at || workout.created_at
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      {workout.exercises.length} Exercises
                    </p>
                    <ul className="text-sm text-muted-foreground">
                      {workout.exercises.slice(0, 3).map((exercise) => (
                        <li
                          key={exercise.id}
                          className="flex items-center justify-between"
                        >
                          <span className="flex items-center gap-2">
                            <img
                              src={exercise.exercise.gif_url}
                              alt={exercise.exercise.name}
                              className="w-10 h-10 rounded-full"
                            />
                            {exercise.exercise.name}
                          </span>
                          <span className="text-xs">
                            {exercise.sets && `${exercise.sets} sets`}
                            {exercise.reps && ` × ${exercise.reps} reps`}
                            {exercise.duration && ` - ${exercise.duration}s`}
                          </span>
                        </li>
                      ))}
                      {workout.exercises.length > 3 && (
                        <li>+{workout.exercises.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link
                      href={`/athlete/${workout.id}`}
                      className="flex items-center justify-center"
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Start Workout
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
