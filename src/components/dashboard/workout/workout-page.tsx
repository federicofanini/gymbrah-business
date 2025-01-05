import { createClient } from "@/utils/supabase/server";
import { WorkoutForm } from "./workout-form";
import { redirect } from "next/navigation";
import { SavedWorkouts } from "./saved-workouts";

export async function WorkoutPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth");
  }

  return (
    <div>
      <WorkoutForm userId={session.user.id} />
      <SavedWorkouts userId={session.user.id} />
    </div>
  );
}
