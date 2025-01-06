"use client";

import { Card } from "@/components/ui/card";
import { format, startOfWeek, addDays } from "date-fns";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DotIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import { WorkoutCard } from "./workout-card";

const today = new Date();
const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Start on Monday

const WEEKDAYS = Array.from({ length: 7 }, (_, i) => {
  const date = addDays(weekStart, i);
  return {
    name: format(date, "EEEE"),
    shortName: format(date, "EEE"), // Add short name for mobile
    date: date,
    isToday: format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd"),
  };
});

export function WeeklyMenu() {
  return (
    <Card className="w-[calc(100vw-2rem)] sm:w-full border-none">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Tabs
            defaultValue={
              WEEKDAYS.find((day) => day.isToday)?.name || WEEKDAYS[0].name
            }
            className="w-full"
          >
            <ScrollArea className="w-full">
              <TabsList className="w-max min-w-full justify-start">
                {WEEKDAYS.map((day) => (
                  <TabsTrigger
                    key={day.name}
                    value={day.name}
                    className={`min-w-[4.5rem]`}
                  >
                    <span className="text-xs text-muted-foreground font-medium">
                      {day.isToday ? (
                        <div className="flex items-center text-primary gap-1">
                          <div className="size-[6px] rounded-full bg-green-500" />
                          {format(day.date, "EEE, MMM d")}
                        </div>
                      ) : (
                        <>{format(day.date, "EEE, MMM d")}</>
                      )}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>
            {WEEKDAYS.map((day) => (
              <TabsContent
                key={day.name}
                value={day.name}
                className="text-xs sm:text-sm min-h-[3rem] sm:min-h-[4rem] rounded-md p-1.5 sm:p-2"
              >
                <span className="text-xs font-semibold">
                  {day.isToday
                    ? "Today"
                    : format(day.date, "yyyy-MM-dd") ===
                      format(addDays(today, 1), "yyyy-MM-dd")
                    ? "Tomorrow"
                    : format(day.date, "MMM d, yyyy - EEEE")}
                </span>
                <Separator className="my-2" />
                <div className="flex items-center gap-1 mt-4">
                  <WorkoutCard />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
        <div className="">
          {/* Content for the third column */}
          third column
        </div>
      </div>
    </Card>
  );
}
