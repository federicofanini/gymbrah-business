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
  Crosshair,
  Trophy,
  HeaterIcon,
  HeartPulse,
} from "lucide-react";

export const sidebarItems = {
  navMain: [
    {
      title: "Blackboard",
      url: "/blackboard",
      icon: BicepsFlexed,
      isActive: true,
      items: [
        {
          title: "Workouts",
          url: "/blackboard/workouts",
        },
        {
          title: "Achievements",
          url: "/blackboard/achievements",
        },
      ],
    },
    {
      title: "Health Profile",
      url: "/blackboard/health-profile",
      icon: User,
      isActive: true,
      items: [
        {
          title: "Profile",
          url: "/blackboard/profile",
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
  items: [
    {
      name: "Blackboard",
      url: "/blackboard",
      icon: Frame,
    },
    {
      name: "Workouts",
      url: "/blackboard/workouts",
      icon: Dumbbell,
    },
    {
      name: "Achievements",
      url: "/blackboard/achievements",
      icon: Trophy,
    },
    {
      name: "Health Profile",
      url: "/blackboard/health-profile",
      icon: HeartPulse,
    },
  ],
};
