import { Dumbbell } from "lucide-react";
import {
  MdDashboard,
  MdSportsGymnastics,
  MdBatchPrediction,
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
];
