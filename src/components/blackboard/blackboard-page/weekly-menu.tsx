import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "../../ui/separator";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkoutCard } from "./workout-card";
import { DailyWorkout } from "./daily-workout";
import { FinishButton } from "./finish-button";
import { SetFrequencyDialog } from "./set-frequency-dialog";
import { EditScheduleButton } from "./set-frequency-dialog";
import {
  getCachedWorkoutFrequency,
  getCachedWorkoutsByDay,
} from "@/actions/workout/cached-workout";

const WEEKDAYS = [
  { name: "Monday", shortName: "Mon", value: "1" },
  { name: "Tuesday", shortName: "Tue", value: "2" },
  { name: "Wednesday", shortName: "Wed", value: "3" },
  { name: "Thursday", shortName: "Thu", value: "4" },
  { name: "Friday", shortName: "Fri", value: "5" },
  { name: "Saturday", shortName: "Sat", value: "6" },
  { name: "Sunday", shortName: "Sun", value: "7" },
];

export async function WeeklyMenu() {
  const frequencyResponse = await getCachedWorkoutFrequency();
  const workoutsResponse = await getCachedWorkoutsByDay();

  if (!frequencyResponse.success || !frequencyResponse.data) {
    return <SetFrequencyDialog />;
  }

  const userDays = frequencyResponse.data.frequency?.split(",") || [];
  const hasFrequency = userDays.length > 0;

  const defaultDay =
    WEEKDAYS.find((day) => userDays.includes(day.value))?.name ||
    WEEKDAYS[0].name;

  if (!hasFrequency) {
    return <SetFrequencyDialog />;
  }

  const workoutsByDay = workoutsResponse.success ? workoutsResponse.data : {};

  return (
    <Card className="w-[calc(100vw-2rem)] sm:w-full border-none">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <Tabs defaultValue={defaultDay} className="w-full">
              <ScrollArea className="w-full">
                <TabsList className="w-max min-w-full justify-start">
                  {WEEKDAYS.filter((day) => userDays.includes(day.value)).map(
                    (day) => (
                      <TabsTrigger
                        key={day.name}
                        value={day.name}
                        className="min-w-[4.5rem]"
                      >
                        <span className="text-xs text-muted-foreground font-medium">
                          <span className="hidden sm:inline">{day.name}</span>
                          <span className="sm:hidden">{day.shortName}</span>
                        </span>
                      </TabsTrigger>
                    )
                  )}
                </TabsList>
              </ScrollArea>
              {WEEKDAYS.filter((day) => userDays.includes(day.value)).map(
                (day) => (
                  <TabsContent
                    key={day.name}
                    value={day.name}
                    className="text-xs sm:text-sm min-h-[3rem] sm:min-h-[4rem] rounded-md p-1.5 sm:p-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">{day.name}</span>
                      <EditScheduleButton />
                    </div>
                    <Separator className="my-2" />
                    <div className="space-y-4">
                      <Suspense fallback={<Skeleton className="w-full h-32" />}>
                        <WorkoutCard workoutData={workoutsByDay[day.value]} />
                      </Suspense>
                      <Suspense fallback={<Skeleton className="w-full h-24" />}>
                        <DailyWorkout workoutData={workoutsByDay[day.value]} />
                      </Suspense>
                      <Suspense fallback={<Skeleton className="w-full h-10" />}>
                        <FinishButton />
                      </Suspense>
                    </div>
                  </TabsContent>
                )
              )}
            </Tabs>
          </div>
        </div>
        <div className="">
          {/* Content for the third column */}
          third column
        </div>
      </div>
    </Card>
  );
}
