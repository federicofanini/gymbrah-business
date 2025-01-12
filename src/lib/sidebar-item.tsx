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
  Code,
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
      url: "/blackboard/feedback",
      icon: Feather,
    },
    {
      title: "Contribute",
      url: "https://github.com/federicofanini/gymbrah.com",
      icon: Github,
    },
  ],
  fitness: [
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
  coding: [
    {
      name: "Coding",
      url: "/coding",
      icon: Code,
    },
  ],
  startup: [
    {
      name: "Startup",
      url: "/startup",
      icon: Frame,
    },
  ],
};
