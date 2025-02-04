import { Suspense } from "react";
import { AthletePage } from "@/components/private/b2b/athletes/page/athletes-page";
import { getAthleteById } from "@/actions/business/athletes/get-athlete-by-id";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

interface AthleteData {
  id: string;
  full_name: string;
  goal: string;
  gender_age: string;
  status: string;
}

interface FormattedAthleteData {
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
  workouts: {
    id: string;
    name: string;
    date: string;
    status: "completed" | "scheduled" | "missed";
    type: string;
    duration: number;
  }[];
}

function LoadingSkeleton() {
  return (
    <div className="w-full px-4 md:px-8 py-4 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

type PageParams = { athleteId: string } & Promise<any>;

export default async function Athlete({ params }: { params: PageParams }) {
  const { athleteId } = await params;
  const result = await getAthleteById({ athleteId });

  if (!result?.data?.success || !result.data) {
    return (
      <div className="w-full px-4 md:px-8 py-4">
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Unable to load athlete details
          </p>
        </div>
      </div>
    );
  }

  const athleteData = result.data.data as AthleteData;
  const [gender] = athleteData.gender_age.split(" - ");

  const formattedAthleteData: FormattedAthleteData = {
    id: athleteId,
    fullName: athleteData.full_name,
    goal: athleteData.goal,
    gender,
    age: parseInt(athleteData.gender_age.split("y")[0].split(" - ")[1]),
    isActive: athleteData.status === "Active",
    stats: {
      workoutsCompleted: 156, // Mock data
      currentStreak: 5,
      bestStreak: 14,
      joinedDate: "2023-09-15",
    },
    recentWorkouts: [
      { date: "2024-01-15", name: "Upper Body Strength", completed: true },
      { date: "2024-01-13", name: "Lower Body Power", completed: true },
      { date: "2024-01-11", name: "Core & Mobility", completed: true },
    ],
    workouts: [
      {
        id: "1",
        name: "Upper Body Strength",
        date: "2024-01-15",
        status: "completed" as const,
        type: "Strength",
        duration: 60,
      },
      {
        id: "2",
        name: "Lower Body Power",
        date: "2024-01-13",
        status: "completed" as const,
        type: "Power",
        duration: 45,
      },
      {
        id: "3",
        name: "Core & Mobility",
        date: "2024-01-11",
        status: "completed" as const,
        type: "Mobility",
        duration: 30,
      },
      {
        id: "4",
        name: "Full Body Circuit",
        date: "2024-01-17",
        status: "scheduled" as const,
        type: "Circuit",
        duration: 45,
      },
    ],
  };

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <AthletePage athlete={formattedAthleteData} />
    </Suspense>
  );
}
