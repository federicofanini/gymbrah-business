import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MdSettings } from "react-icons/md";

export async function SettingsButton() {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="[&>svg]:size-5 size-[70px] hidden md:flex items-center justify-center border-b border-r border-l border-primary rounded-none"
    >
      <Link href="/blackboard/settings">
        <MdSettings />
      </Link>
    </Button>
  );
}
