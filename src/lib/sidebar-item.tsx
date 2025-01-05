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
  Feather,
  Github,
  User,
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
          title: "Workouts",
          url: "/dashboard/workouts",
        },
        {
          title: "Achievements",
          url: "/dashboard/achievements",
        },
      ],
    },
    {
      title: "Health Profile",
      url: "/dashboard/health-profile",
      icon: User,
      isActive: true,
      items: [
        {
          title: "Profile",
          url: "/dashboard/profile",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Feedback",
      url: "/dashboard/feedback",
      icon: Feather,
    },
    {
      title: "Contribute",
      url: "https://github.com/federicofanini/gymbrah.com",
      icon: Github,
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
