import {
  SquareTerminal,
  BookOpen,
  Settings2,
  LifeBuoy,
  Send,
  Frame,
  PieChart,
  Map,
  Bot,
  Dumbbell,
  Apple,
  BicepsFlexed,
} from "lucide-react";

export const sidebarItems = {
  navMain: [
    {
      title: "Blackboard",
      url: "/dashboard",
      icon: BicepsFlexed,
      isActive: true,
      items: [
        {
          title: "Profile",
          url: "/dashboard/profile",
        },
        {
          title: "Workouts",
          url: "/dashboard/workouts",
        },
        {
          title: "Achievements",
          url: "/dashboard/achievements",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};
