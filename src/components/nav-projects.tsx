"use client";

import {
  Folder,
  MoreHorizontal,
  Share,
  Trash2,
  Frame,
  PieChart,
  Map,
  BicepsFlexed,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { sidebarItems } from "@/lib/sidebar-item";

export function NavProjects() {
  const pathname = usePathname();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="font-mono">TINY HABITS</SidebarGroupLabel>
      <SidebarMenu>
        {sidebarItems.items.map((item) => {
          const IconComponent = item.icon;
          const isActive = pathname === item.url;

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                className={
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : ""
                }
              >
                <Link href={item.url}>
                  <IconComponent className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
