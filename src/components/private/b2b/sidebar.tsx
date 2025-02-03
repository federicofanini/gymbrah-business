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
  MdBatteryCharging90,
  MdDashboard,
  MdGraphicEq,
  MdOutlineSettings,
  MdOutlineStackedBarChart,
} from "react-icons/md";
import { LogoIcon } from "@/components/logo";

export function Sidebar() {
  const params = useParams();
  const pathname = usePathname();

  const navigation = [
    {
      icon: MdDashboard,
      label: "Blackboard",
      path: `/blackboard`,
      isActive: pathname === `/blackboard`,
    },
    {
      icon: MdAirlineStops,
      label: "Unique Value Zones",
      path: `/blackboard/uvz`,
      isActive: pathname === `/blackboard/uvz`,
    },
    {
      icon: MdAutoFixHigh,
      label: "Pitch",
      path: `/blackboard/pitch`,
      isActive: pathname === `/blackboard/pitch`,
    },
    {
      icon: MdBatchPrediction,
      label: "Productizing",
      path: `/blackboard/productizing`,
      isActive: pathname === `/blackboard/productizing`,
    },
    {
      icon: MdBallot,
      label: "Case Studies",
      path: `/blackboard/case-studies`,
      isActive: pathname === `/blackboard/case-studies`,
    },
    {
      icon: MdBatteryCharging90,
      label: "Wheels",
      path: `/blackboard/wheels`,
      isActive: pathname === `/blackboard/wheels`,
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
