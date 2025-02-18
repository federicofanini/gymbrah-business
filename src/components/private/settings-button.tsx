import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Settings } from "lucide-react";

export async function SettingsButton() {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="[&>svg]:size-5 size-[70px] hidden md:flex items-center justify-center border-r border-l border-primary rounded-none"
    >
      <Link href="/business/settings">
        <Settings />
      </Link>
    </Button>
  );
}
