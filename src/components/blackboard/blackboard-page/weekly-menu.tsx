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
import { format, startOfWeek, addDays } from "date-fns";

const today = new Date();
const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Start from Monday

const WEEKDAYS = [
  { name: "Monday", shortName: "Mon", value: "1", date: weekStart },
  {
    name: "Tuesday",
    shortName: "Tue",
    value: "2",
    date: addDays(weekStart, 1),
  },
  {
    name: "Wednesday",
    shortName: "Wed",
    value: "3",
    date: addDays(weekStart, 2),
  },
  {
    name: "Thursday",
    shortName: "Thu",
    value: "4",
    date: addDays(weekStart, 3),
  },
  { name: "Friday", shortName: "Fri", value: "5", date: addDays(weekStart, 4) },
  {
    name: "Saturday",
    shortName: "Sat",
    value: "6",
    date: addDays(weekStart, 5),
  },
  { name: "Sunday", shortName: "Sun", value: "7", date: addDays(weekStart, 6) },
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
    WEEKDAYS.find(
      (day) => format(day.date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")
    )?.name || WEEKDAYS[0].name;

  if (!hasFrequency) {
    return <SetFrequencyDialog />;
  }

  const workoutsByDay = workoutsResponse.success ? workoutsResponse.data : {};

  return (
    <Card className="w-[calc(100vw-2rem)] sm:w-full border-none">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <Tabs defaultValue={defaultDay} className="w-full border">
              <div className="w-full overflow-x-auto sm:mx-auto">
                <TabsList className="w-full inline-flex min-w-[640px] sm:min-w-0">
                  {WEEKDAYS.filter((day) => userDays.includes(day.value)).map(
                    (day) => (
                      <TabsTrigger
                        key={day.name}
                        value={day.name}
                        className="flex-1 min-w-[4.5rem] relative"
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-muted-foreground font-medium">
                            <span className="hidden sm:inline">{day.name}</span>
                            <span className="sm:hidden">{day.shortName}</span>
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {format(day.date, "EEE MM/dd")}
                          </span>
                          {format(day.date, "yyyy-MM-dd") ===
                            format(today, "yyyy-MM-dd") && (
                            <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          )}
                        </div>
                      </TabsTrigger>
                    )
                  )}
                </TabsList>
              </div>
              <ScrollArea className="h-full">
                {WEEKDAYS.filter((day) => userDays.includes(day.value)).map(
                  (day) => (
                    <TabsContent
                      key={day.name}
                      value={day.name}
                      className="text-xs sm:text-sm min-h-[3rem] sm:min-h-[4rem] rounded-md p-1.5 sm:p-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">
                          {day.name} - {format(day.date, "MMM dd, yyyy")}
                        </span>
                        <EditScheduleButton />
                      </div>
                      <Separator className="my-2" />
                      <div className="space-y-4">
                        <Suspense
                          fallback={<Skeleton className="w-full h-32" />}
                        >
                          <WorkoutCard workoutData={workoutsByDay[day.value]} />
                        </Suspense>
                        <Suspense
                          fallback={<Skeleton className="w-full h-24" />}
                        >
                          <DailyWorkout
                            workoutData={workoutsByDay[day.value]}
                          />
                        </Suspense>
                        <Suspense
                          fallback={<Skeleton className="w-full h-10" />}
                        >
                          <FinishButton />
                        </Suspense>
                      </div>
                    </TabsContent>
                  )
                )}
              </ScrollArea>
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
