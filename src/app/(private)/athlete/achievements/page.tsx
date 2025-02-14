import { getUserGamificationData } from "@/actions/achievements/get-user-data";
import { AchievementsPage } from "@/components/private/b2c/achievements/ach-page";
import { getUserMetadata } from "@/utils/supabase/database/cached-queries";
import { Loader2 } from "lucide-react";

export default async function Achievements() {
  const data = await getUserGamificationData();
  const userData = await getUserMetadata();

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="size-4 animate-spin" />
      </div>
    );
  }

  return <AchievementsPage data={data} profile={userData} />;
}
