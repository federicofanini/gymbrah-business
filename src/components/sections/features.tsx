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
import Image from "next/image";

const businessFeatures = [
  {
    name: "Member Management",
    description:
      "Track and manage your gym members with ease. Monitor attendance, progress and engagement.",
    icon: <Users className="w-8 h-8" />,
    image: "/features/members.png",
    color: "from-blue-100 to-blue-50",
  },
  {
    name: "Performance Analytics",
    description:
      "Get detailed insights into your gym's performance with comprehensive analytics and reporting.",
    icon: <LineChart className="w-8 h-8" />,
    image: "/features/analytics.png",
    color: "from-green-100 to-green-50",
  },
  {
    name: "Equipment Tracking",
    description:
      "Keep track of your gym equipment, maintenance schedules and usage patterns.",
    icon: <Dumbbell className="w-8 h-8" />,
    image: "/features/equipment.png",
    color: "from-purple-100 to-purple-50",
  },
];

const athleteFeatures = [
  {
    name: "Goal Setting",
    description:
      "Set and track your fitness goals. Monitor your progress and stay motivated.",
    icon: <Target className="w-8 h-8" />,
    image: "/wheel.png",
    color: "from-orange-100 to-orange-50",
  },
  {
    name: "Achievement Tracking",
    description:
      "Track your achievements and milestones. Celebrate your progress along the way.",
    icon: <Trophy className="w-8 h-8" />,
    image: "/features/achievements.png",
    color: "from-pink-100 to-pink-50",
  },
  {
    name: "Workout Tracking",
    description:
      "Log and monitor your workouts. Track sets, reps, weights and personal records.",
    icon: <Flame className="w-8 h-8" />,
    image: "/features/workouts.png",
    color: "from-yellow-100 to-yellow-50",
  },
];

const FeatureCard = ({
  name,
  description,
  icon: Icon,
  image,
  color,
  index,
}: (typeof businessFeatures)[0] & { index: number }) => {
  return (
    <div
      key={index}
      className="relative flex h-[400px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background"
    >
      <div className="flex flex-col items-center gap-4 relative z-10">
        <div className="rounded-lg bg-primary/10 p-3 w-fit">{Icon}</div>

        <h3 className="font-semibold text-xl text-center">{name}</h3>
        <p className="text-sm text-muted-foreground max-w-lg text-center">
          {description}
        </p>
      </div>

      <div className="absolute bottom-0 right-0 w-3/4 h-3/4">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 75vw, 50vw"
        />
      </div>
    </div>
  );
};

export function Features() {
  return (
    <>
      <Section id="business" title="For Gyms" subtitle="Empower Your Business">
        <div className="flex flex-col gap-4 mx-auto p-6 border-x">
          {businessFeatures.map(
            ({ name, description, icon: Icon, image, color }, index) => (
              <FeatureCard
                key={index}
                name={name}
                description={description}
                icon={Icon}
                image={image}
                color={color}
                index={index}
              />
            )
          )}
        </div>
      </Section>

      <Section
        id="athletes"
        title="For Athletes"
        subtitle="Track Your Progress"
      >
        <div className="flex flex-col gap-4 mx-auto p-6 border-x">
          {athleteFeatures.map(
            ({ name, description, icon: Icon, image, color }, index) => (
              <FeatureCard
                key={index}
                name={name}
                description={description}
                icon={Icon}
                image={image}
                color={color}
                index={index}
              />
            )
          )}
        </div>
      </Section>
    </>
  );
}
