import { Medal } from "lucide-react";
import { MdSportsGymnastics } from "react-icons/md";

export const sidebarItems = [
  {
    icon: MdSportsGymnastics,
    label: "Home",
    path: `/athlete`,
  },
  {
    icon: Medal,
    label: "Achievements",
    path: `/athlete/achievements`,
  },
  // {
  //   icon: Dumbbell,
  //   label: "Workouts",
  //   path: `/athlete/workouts`,
  // },
];
