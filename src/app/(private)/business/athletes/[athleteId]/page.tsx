import { Suspense } from "react";
import { AthletePage } from "@/components/private/b2b/athletes/page/athletes-page";
import { getAthleteById } from "@/actions/business/athletes/get-athlete-by-id";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface AthleteData {
  id: string;
  full_name: string;
  goal: string;
  gender_age: string;
  status: string;
}

async function AthletePageWrapper({ athleteId }: { athleteId: string }) {
  const result = await getAthleteById({ athleteId });

  if (!result?.data?.success || !result.data) {
    throw new Error("Failed to load athlete data");
  }

  const athleteData = result.data.data as AthleteData;
  const [gender] = athleteData.gender_age.split(" - ");

  const formattedAthleteData = {
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
  };

  return <AthletePage athlete={formattedAthleteData} />;
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

export default function Athlete({ params }: { params: { athleteId: string } }) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <AthletePageWrapper athleteId={params.athleteId} />
    </Suspense>
  );
}
