"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryState } from "nuqs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { Workout, WorkoutsTab } from "./workouts";
import Link from "next/link";
import { Overview } from "./overview";
import { AthleteData } from "./overview";

export interface ExtendedAthleteData extends AthleteData {
  fullName: string;
  goal: string;
  gender: string;
  age: number;
  workouts: {
    id: string;
    name: string;
    date: string;
    status: string;
  }[];
}

export interface AthletePageProps {
  athlete: ExtendedAthleteData;
}

const tabs = [
  { id: "overview", title: "Overview" },
  { id: "workouts", title: "Workouts" },
  { id: "progress", title: "Progress" },
  { id: "settings", title: "Settings" },
];

export function AthletePage({ athlete }: AthletePageProps) {
  const [tab, setTab] = useQueryState("tab", {
    defaultValue: "overview",
  });

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
          <Overview athlete={athlete} />
        </TabsContent>

        <TabsContent value="workouts">
          <WorkoutsTab workouts={athlete.workouts as Workout[]} />
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
