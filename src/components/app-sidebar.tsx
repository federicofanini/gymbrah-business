import * as React from "react";
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { sidebarItems } from "@/lib/sidebar-item";

// Define the prop types based on the components
type NavMainProps = {
  items: Array<{
    title: string;
    url: string;
    icon: string;
    isActive?: boolean;
    items?: Array<{
      title: string;
      url: string;
    }>;
  }>;
};

type NavProjectsProps = {
  projects: Array<{
    name: string;
    url: string;
    icon: string;
  }>;
};

type NavSecondaryProps = {
  items: Array<{
    title: string;
    url: string;
    icon: string;
  }>;
  className?: string;
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  "use client";

  const supabase = createClient();

  const handleSignOut = React.useCallback(async () => {
    await supabase.auth.signOut();
  }, [supabase]);

  // Serialize the icon components to strings before passing to client components
  const serializedNavMain = sidebarItems.navMain.map((item) => ({
    ...item,
    icon: item.icon.name, // Pass just the name/identifier of the icon
  }));

  const serializedProjects = sidebarItems.projects.map((project) => ({
    ...project,
    icon: project.icon.name,
  }));

  const serializedNavSecondary = sidebarItems.navSecondary.map((item) => ({
    ...item,
    icon: item.icon.name,
  }));

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={serializedNavMain as NavMainProps["items"]} />
        <NavProjects
          projects={serializedProjects as NavProjectsProps["projects"]}
        />
        <NavSecondary
          items={serializedNavSecondary as NavSecondaryProps["items"]}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
