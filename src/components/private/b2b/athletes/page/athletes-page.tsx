"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryState } from "nuqs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Activity,
  Trophy,
  Calendar,
  ArrowLeftIcon,
} from "lucide-react";
import { WorkoutsTab } from "./workouts";
import Link from "next/link";

interface AthletePageProps {
  athlete: {
    id: string;
    fullName: string;
    goal: string;
    gender: string;
    age: number;
    isActive: boolean;
    stats: {
      workoutsCompleted: number;
      currentStreak: number;
      bestStreak: number;
      joinedDate: string;
    };
    recentWorkouts: {
      date: string;
      name: string;
      completed: boolean;
    }[];
  };
}

export function AthletePage({ athlete }: AthletePageProps) {
  const [tab, setTab] = useQueryState("tab", {
    defaultValue: "overview",
  });

  const tabs = [
    { id: "overview", title: "Overview" },
    { id: "workouts", title: "Workouts" },
    { id: "progress", title: "Progress" },
    { id: "settings", title: "Settings" },
  ];

  return (
    <div className="w-full px-4 md:px-8 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-bold">{athlete.fullName}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{athlete.goal}</Badge>
            <span className="text-sm text-muted-foreground">
              {athlete.gender} • {athlete.age} years
            </span>
          </div>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link
            href={`/business/athletes`}
            className="flex items-center justify-center gap-2 text-sm"
          >
            <ArrowLeftIcon className="size-4" />
            Go Back
          </Link>
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="justify-start rounded-none h-auto p-0 bg-transparent space-x-4 md:space-x-6 overflow-x-auto">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="rounded-none border-b-2 border-transparent text-primary data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2 text-sm md:text-base whitespace-nowrap"
            >
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">
                  Workouts
                </CardTitle>
                <Activity className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-2xl font-bold">
                  {athlete.stats.workoutsCompleted}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">
                  Current Streak
                </CardTitle>
                <LineChart className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-2xl font-bold">
                  {athlete.stats.currentStreak} days
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">
                  Best Streak
                </CardTitle>
                <Trophy className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-2xl font-bold">
                  {athlete.stats.bestStreak} days
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">
                  Member Since
                </CardTitle>
                <Calendar className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-2xl font-bold">
                  {new Date(athlete.stats.joinedDate).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base md:text-lg">
                Recent Workouts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {athlete.recentWorkouts.map((workout, i) => (
                  <div
                    key={i}
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
        </TabsContent>

        <TabsContent value="workouts">
          <WorkoutsTab />
        </TabsContent>

        <TabsContent value="progress">
          <div className="text-center py-8 text-muted-foreground text-sm md:text-base">
            Progress tracking coming soon
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="text-center py-8 text-muted-foreground text-sm md:text-base">
            Settings panel coming soon
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
