import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Athlete } from "../_components/athlete";
import { Cookies } from "@/utils/constants";
import { prisma } from "@/lib/db";
import { saveUser } from "@/actions/athlete/save-user";

export default async function OnboardingAthletePage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const cookieStore = await cookies();
  const athleteCode = cookieStore.get(Cookies.AthleteCode)?.value;

  if (athleteCode) {
    const athlete = await prisma.athlete.findUnique({
      where: {
        athlete_code: athleteCode,
      },
    });

    if (athlete) {
      // Update athlete with user id and email if different
      await prisma.athlete.update({
        where: {
          athlete_code: athleteCode,
        },
        data: {
          user_id: session.user.id,
          ...(athlete.email !== session.user.email && {
            email: session.user.email,
          }),
        },
      });

      // Save user data
      const result = await saveUser({
        email: session.user.email ?? athlete.email,
        full_name: `${athlete.name} ${athlete.surname}`,
        avatar_url: session.user.user_metadata.avatar_url,
      });

      if (!result?.data?.success) {
        throw new Error("Failed to save user data");
      }

      // Redirect to athlete dashboard since onboarding is complete
      redirect("/athlete");
    }
  }

  return <Athlete />;
}
