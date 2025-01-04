import { AchievementsList } from "./achivements-list";
import { ProfileSummary } from "./profile-summary";
import { WorkoutCarousel } from "./workout-carousel";
import { WorkoutPlan } from "./workout-plan";

export default function DashboardPage() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:flex">
        <ProfileSummary />
        <AchievementsList />
        <WorkoutPlan />
      </div>
      <div className="grid grid-cols-1 gap-4 md:flex">
        <WorkoutCarousel />
      </div>
    </>
  );
}
