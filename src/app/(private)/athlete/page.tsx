import { Suspense } from "react";
import { GymDetails } from "@/components/private/b2c/athlete/gym";
import { WorkoutCarousel } from "@/components/private/b2c/athlete/workout";
import { getWorkoutsFromBusiness } from "@/actions/workout/athlete/workouts-from-business";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Achievements from "./achievements/page";
import { AchievementsPage } from "@/components/private/b2c/achievements/ach-page";
import { getUserGamificationData } from "@/actions/achievements/get-user-data";
import { getUserMetadata } from "@/utils/supabase/database/cached-queries";
import { Loader2 } from "lucide-react";

async function BlackboardWrapper() {
  const workoutsResponse = await getWorkoutsFromBusiness();
  console.log("workout from business", workoutsResponse);

  const workouts = workoutsResponse?.data?.success
    ? workoutsResponse.data.data
    : [];

  return (
    <div className="w-full px-4 md:px-8 py-4 space-y-6">
      <WorkoutCarousel workouts={workouts} businessName="Business Name" />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="w-full px-4 md:px-8 py-4 space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-x-auto">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-72 flex-shrink-0" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function Blackboard() {
  const data = await getUserGamificationData();
  const profile = await getUserMetadata();

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="size-4 animate-spin" />
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <AchievementsPage data={data} profile={profile} />
      <BlackboardWrapper />
    </Suspense>
  );
}
