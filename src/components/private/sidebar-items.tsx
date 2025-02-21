import { Dumbbell } from "lucide-react";
import {
  MdDashboard,
  MdSportsGymnastics,
  MdBatchPrediction,
  MdAppShortcut,
} from "react-icons/md";

export const sidebarItems = [
  {
    icon: MdDashboard,
    label: "Your Gym",
    path: `/business`,
  },
  {
    icon: MdSportsGymnastics,
    label: "Athletes",
    path: `/business/athletes`,
  },
  {
    icon: Dumbbell,
    label: "Workouts",
    path: `/business/workouts`,
  },
  {
    icon: MdBatchPrediction,
    label: "Feedback",
    path: `/business/feedback`,
  },
  {
    icon: MdAppShortcut,
    label: "Mobile App",
    path: `/business/mobile-app`,
  },
];
