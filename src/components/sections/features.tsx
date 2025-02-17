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
import {
  MdAccessAlarm,
  MdAccessTime,
  MdAnalytics,
  MdApps,
  MdAttachMoney,
  MdBarChart,
  MdContentCopy,
  MdDashboard,
  MdOutlineContentCopy,
  MdOutlineEventBusy,
  MdPeople,
  MdPersonOff,
  MdSportsGymnastics,
  MdSync,
  MdTrendingDown,
  MdTrendingUp,
  MdVerified,
} from "react-icons/md";

const businessQuestions = [
  {
    name: "Hours Wasted",
    description:
      "Likely 15-20 hours per week switching between apps to manage your fitness business.",
    icon: <MdAccessTime className="w-8 h-8 text-red-600" />,
  },
  {
    name: "Missed Opportunities",
    description:
      "Lost sponsorships and content ideas from untracked workout data.",
    icon: <MdOutlineEventBusy className="w-8 h-8 text-red-600" />,
  },
  {
    name: "Turning Away Clients",
    description:
      "Manual admin limits you to around 15-20 clients, making it hard to scale.",
    icon: <MdPersonOff className="w-8 h-8 text-red-600" />,
  },
  {
    name: "Lost Revenue",
    description:
      "Without clear performance data, you're missing out on high-paying clients and sponsor deals.",
    icon: <MdAttachMoney className="w-8 h-8 text-red-600" />,
  },
  {
    name: "Stop Copying Data",
    description:
      "Automate everything—no more manual transfers between spreadsheets.",
    icon: <MdSync className="w-8 h-8 text-red-600" />,
  },
  {
    name: "Inconsistent Client Results",
    description:
      "Without a system to track and adjust workouts, delivering consistent client results is harder.",
    icon: <MdTrendingDown className="w-8 h-8 text-red-600" />,
  },
];

const businessFeatures = [
  {
    name: "Save Time",
    description:
      "Automate admin tasks and focus on coaching, saving hours every week.",
    icon: <MdAccessTime className="w-8 h-8 text-green-600" />,
  },
  {
    name: "Professional Brand",
    description:
      "Deliver a seamless client experience that strengthens your fitness brand.",
    icon: <MdVerified className="w-8 h-8 text-green-600" />,
  },
  {
    name: "Extra Hours",
    description:
      "20 extra hours means more clients, better content, and faster business growth.",
    icon: <MdAccessAlarm className="w-8 h-8 text-green-600" />,
  },
  {
    name: "Sponsor Proof",
    description:
      "Sponsors need real, trackable data—GymBrah delivers it instantly.",
    icon: <MdVerified className="w-8 h-8 text-green-600" />,
  },
  {
    name: "Double Capacity",
    description:
      "Automation lets you manage more clients without adding more work.",
    icon: <MdPeople className="w-8 h-8 text-green-600" />,
  },
  {
    name: "One System",
    description:
      "Why manage five apps when you could use just one? GymBrah is your all-in-one solution.",
    icon: <MdApps className="w-8 h-8 text-green-600" />,
  },
];

const FeatureCard = ({
  name,
  description,
  icon: Icon,
  index,
  color,
}: (typeof businessQuestions)[0] & { index: number; color: string }) => {
  return (
    <div
      key={index}
      className="group relative flex py-12 w-full flex-col items-center justify-center overflow-hidden border bg-background shadow-sm transition-all hover:shadow-lg"
    >
      {/* Content */}
      <div className="flex flex-col items-center gap-6 relative z-10 px-6">
        <div
          className={cn(
            "rounded-xl  p-4 w-fit ring-1 shadow-sm transition-transform duration-300 group-hover:scale-110",
            color
          )}
        >
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
        id="business-questions"
        subtitle="Why manage five apps when you could use just one?"
        color="#d40606"
      >
        <div className="gap-4 mx-auto p-6  grid sm:grid-cols-3">
          {businessQuestions.map(({ name, description, icon: Icon }, index) => (
            <FeatureCard
              key={index}
              name={name}
              description={description}
              icon={Icon}
              index={index}
              color="ring-red-500 bg-red-500/10"
            />
          ))}
        </div>
      </Section>

      <Section
        id="business-features"
        title="Made for Fitness Creators, Gyms and Coaches"
        subtitle="Same fitness business, smarter"
        color="#0aec19"
      >
        <div className="gap-4 mx-auto p-6 grid sm:grid-cols-3">
          {businessFeatures.map(({ name, description, icon: Icon }, index) => (
            <FeatureCard
              key={index}
              name={name}
              description={description}
              icon={Icon}
              index={index}
              color="ring-green-500 bg-green-500/10"
            />
          ))}
        </div>
      </Section>
    </>
  );
}
