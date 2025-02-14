import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Medal } from "lucide-react";

export async function AchievementsButton() {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="[&>svg]:size-5 size-[70px] hidden md:flex items-center justify-center border-r border-l border-primary rounded-none"
    >
      <Link href="/athlete/achievements">
        <Medal />
      </Link>
    </Button>
  );
}
