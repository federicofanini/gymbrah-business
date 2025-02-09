import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function Onboarding() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="w-full max-w-3xl mx-auto h-screen flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold mb-8">What best describes you?</h1>
      <Button size="lg" className="w-full max-w-sm" asChild>
        <Link href="/onboarding/business">
          I&apos;m a Gym or Personal Trainer
        </Link>
      </Button>
      <Button size="lg" className="w-full max-w-sm" asChild>
        <Link href="/onboarding/athlete">I&apos;m an Athlete</Link>
      </Button>
    </div>
  );
}
