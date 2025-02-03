import { Section } from "@/components/section";
import { cn } from "@/lib/utils";
import {
  Dumbbell,
  Users,
  LineChart,
  Target,
  Trophy,
  Flame,
} from "lucide-react";
import { MdAnalytics, MdBarChart, MdSportsGymnastics } from "react-icons/md";

const businessFeatures = [
  {
    name: "Member Management",
    description:
      "Track and manage your gym members with ease. Monitor attendance, progress and engagement.",
    icon: <MdSportsGymnastics className="w-8 h-8 text-cyan-600" />,
  },
  {
    name: "Performance Analytics",
    description:
      "Get detailed insights into your gym's performance with comprehensive analytics and reporting.",
    icon: <MdBarChart className="w-8 h-8 text-cyan-600" />,
  },
  {
    name: "Workouts & Routines",
    description: "Create and manage your athletes workouts and routines.",
    icon: <Dumbbell className="w-8 h-8 text-cyan-600" />,
  },
];

const athleteFeatures = [
  {
    name: "No more workout notes",
    description:
      "No more workout notes on your phone. Just log your workouts and get started.",
    icon: <Target className="w-8 h-8 text-cyan-600" />,
  },
  {
    name: "Achievement Tracking",
    description:
      "Track your achievements and milestones. Celebrate your progress along the way.",
    icon: <Trophy className="w-8 h-8 text-cyan-600" />,
  },
  {
    name: "Workout Tracking",
    description:
      "Log and monitor your workouts. Track sets, reps, weights and personal records.",
    icon: <Flame className="w-8 h-8 text-cyan-600" />,
  },
];

const FeatureCard = ({
  name,
  description,
  icon: Icon,
  index,
}: (typeof businessFeatures)[0] & { index: number }) => {
  return (
    <div
      key={index}
      className="group relative flex py-12 w-full flex-col items-center justify-center overflow-hidden border bg-background shadow-sm transition-all hover:shadow-lg"
    >
      {/* Content */}
      <div className="flex flex-col items-center gap-6 relative z-10 px-6">
        <div className="rounded-xl bg-cyan-500/10 p-4 w-fit ring-1 ring-cyan-500 shadow-sm transition-transform duration-300 group-hover:scale-110">
          {Icon}
        </div>

        <div className="space-y-2 text-center">
          <h3 className="font-semibold text-2xl tracking-tight">{name}</h3>
          <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export function Features() {
  return (
    <>
      <Section
        id="business"
        title="For Gyms"
        subtitle="Same business, smarter gym"
      >
        <div className="gap-4 mx-auto p-6 border-x border-t grid sm:grid-cols-3">
          {businessFeatures.map(({ name, description, icon: Icon }, index) => (
            <FeatureCard
              key={index}
              name={name}
              description={description}
              icon={Icon}
              index={index}
            />
          ))}
        </div>
      </Section>

      <Section
        id="athletes"
        title="For Athletes"
        subtitle="Best workouts, better results"
      >
        <div className="gap-4 mx-auto p-6 border-x border-t grid sm:grid-cols-3">
          {athleteFeatures.map(({ name, description, icon: Icon }, index) => (
            <FeatureCard
              key={index}
              name={name}
              description={description}
              icon={Icon}
              index={index}
            />
          ))}
        </div>
      </Section>
    </>
  );
}
