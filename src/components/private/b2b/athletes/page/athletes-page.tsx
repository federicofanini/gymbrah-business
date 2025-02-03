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

const mockAthleteData = {
  id: "1",
  fullName: "John Smith",
  goal: "Strength",
  gender: "M",
  age: 28,
  isActive: true,
  stats: {
    workoutsCompleted: 156,
    currentStreak: 5,
    bestStreak: 14,
    joinedDate: "2023-09-15",
  },
  recentWorkouts: [
    { date: "2024-01-15", name: "Upper Body Strength", completed: true },
    { date: "2024-01-13", name: "Lower Body Power", completed: true },
    { date: "2024-01-11", name: "Core & Mobility", completed: true },
  ],
};

export function AthletePage() {
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
          <h1 className="text-xl md:text-2xl font-bold">
            {mockAthleteData.fullName}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{mockAthleteData.goal}</Badge>
            <span className="text-sm text-muted-foreground">
              {mockAthleteData.gender} • {mockAthleteData.age} years
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
                  {mockAthleteData.stats.workoutsCompleted}
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
                  {mockAthleteData.stats.currentStreak} days
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
                  {mockAthleteData.stats.bestStreak} days
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
                  {new Date(
                    mockAthleteData.stats.joinedDate
                  ).toLocaleDateString()}
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
                {mockAthleteData.recentWorkouts.map((workout, i) => (
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
