"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Activity, Trophy, Calendar } from "lucide-react";
import { FormattedAthleteData } from "@/app/(private)/business/athletes/[athleteId]/page";

const stats = [
  {
    title: "Workouts",
    value: (athlete: FormattedAthleteData) => athlete.stats.workoutsCompleted,
    icon: Activity,
  },
  {
    title: "Current Streak",
    value: (athlete: FormattedAthleteData) =>
      `${athlete.stats.currentStreak} days`,
    icon: LineChart,
  },
  {
    title: "Best Streak",
    value: (athlete: FormattedAthleteData) =>
      `${athlete.stats.bestStreak} days`,
    icon: Trophy,
  },
  {
    title: "Member Since",
    value: (athlete: FormattedAthleteData) =>
      new Date(athlete.stats.joinedDate).toLocaleDateString(),
    icon: Calendar,
  },
];

interface OverviewProps {
  athlete: FormattedAthleteData;
}

export function Overview({ athlete }: OverviewProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold">
                {stat.value(athlete)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">
            Recent Workouts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {athlete.recentWorkouts.map((workout, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b last:border-0 gap-2"
              >
                <div>
                  <div className="font-medium text-sm md:text-base">
                    {workout.name}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    {new Date(workout.date).toLocaleDateString()}
                  </div>
                </div>
                <Badge
                  variant={workout.completed ? "success" : "secondary"}
                  className="self-start sm:self-center"
                >
                  {workout.completed ? "Completed" : "Pending"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
