"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: string; // Changed from LucideIcon to string
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  // Map icon string names to components
  const getIconComponent = (iconName: string) => {
    const icons = {
      LifeBuoy: ChevronRight,
      Send: ChevronRight,
      // Add other icon mappings as needed
    };
    return icons[iconName as keyof typeof icons] || ChevronRight;
  };

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const IconComponent = getIconComponent(item.icon);
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild size="sm">
                  <a href={item.url}>
                    <IconComponent />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
