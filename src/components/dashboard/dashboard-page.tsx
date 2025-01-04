import { AchievementsList } from "./achivements-list";
import { ProfileSummary } from "./profile-summary";
import { WorkoutPlan } from "./workout-plan";

export default function DashboardPage() {
  return (
    <div className="flex gap-4">
      <ProfileSummary />
      <AchievementsList />
      <WorkoutPlan />
    </div>
  );
}
