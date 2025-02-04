import { getAthleteById } from "@/actions/business/athletes/get-athlete-by-id";
import { AthletePage } from "@/components/private/b2b/athletes/athlete-page";

// Define the type for the dynamic route params
type PageParams = { athleteId: string } & Promise<any>;

export default async function AthleteIdPage({
  params,
}: {
  params: PageParams;
}) {
  const athleteResponse = await getAthleteById({
    athleteId: params.athleteId,
  });

  if (!athleteResponse?.data?.success || !athleteResponse?.data?.data) {
    return (
      <div className="container max-w-[1050px] py-12">
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Unable to load athlete details
          </p>
        </div>
      </div>
    );
  }

  const athleteData = athleteResponse.data.data;
  const [gender] = athleteData.gender_age.split(" - ");

  const formattedAthleteData = {
    id: params.athleteId,
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

  return <AthletePage athlete={formattedAthleteData} />;
}
