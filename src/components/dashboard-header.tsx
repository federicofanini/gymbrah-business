import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";
import { PointsDisplay } from "./blackboard/points";
import { BreadcrumbClient } from "./breadcrumb-client";

interface Segment {
  label: string;
  href: string;
}

export async function DashboardHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <BreadcrumbClient />
      </div>
      <div className="px-4">
        <PointsDisplay />
      </div>
    </header>
  );
}
