"use client";

import {
  Sidebar as SidebarBase,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  MdAirlineStops,
  MdAutoFixHigh,
  MdBallot,
  MdBatchPrediction,
  MdAccessibilityNew,
  MdDashboard,
  MdSportsGymnastics,
} from "react-icons/md";
import { LogoIcon } from "@/components/logo";
import { Dumbbell } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    {
      icon: MdDashboard,
      label: "Your Gym",
      path: `/business`,
      isActive: pathname === `/business`,
    },
    {
      icon: MdSportsGymnastics,
      label: "Athletes",
      path: `/business/athletes`,
      isActive: pathname === `/business/athletes`,
    },
    {
      icon: Dumbbell,
      label: "Workouts",
      path: `/business/workouts`,
      isActive: pathname === `/business/workouts`,
    },
    {
      icon: MdBatchPrediction,
      label: "Website",
      path: `/business/website`,
      isActive: pathname === `/business/website`,
    },
  ];

  return (
    <div className="sticky top-0 h-screen z-10 md:flex hidden">
      <SidebarBase
        collapsible="none"
        className="border-r border-primary bg-noise overflow-hidden"
      >
        <SidebarHeader className="flex justify-center items-center h-[70px] border-b border-primary">
          <Link href="/blackboard">
            <LogoIcon />
          </Link>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="p-0">
              <SidebarMenu className="divide-y divide-primary h-full flex flex-col">
                {navigation.map((item, index) => (
                  <SidebarMenuItem key={item.path}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            asChild
                            isActive={item.isActive}
                            className={cn("[&>svg]:size-5 size-[70px]", {
                              "opacity-50": !item.isActive,
                              "border-b border-primary":
                                index === navigation.length - 1,
                            })}
                          >
                            <Link href={item.path}>
                              <item.icon />
                            </Link>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{item.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </SidebarBase>
    </div>
  );
}
