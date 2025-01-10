"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  RadialBar,
  RadialBarChart,
  Label,
  PolarRadiusAxis,
  Bar,
  BarChart,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Flame,
  Target,
  TrendingUp,
  Calendar,
  Medal,
  Star,
  Award,
  Info,
} from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data
const activityData = [
  { date: "2024-01-01", workouts: 20, points: 1000 },
  { date: "2024-02-01", workouts: 24, points: 1200 },
  { date: "2024-03-01", workouts: 18, points: 900 },
  { date: "2024-04-01", workouts: 28, points: 1400 },
  { date: "2024-05-01", workouts: 22, points: 1100 },
  { date: "2024-06-01", workouts: 30, points: 1500 },
];

const achievementBreakdown = [
  { browser: "Workout Streaks", visitors: 35, fill: "hsl(var(--chart-1))" },
  { browser: "Perfect Weeks", visitors: 25, fill: "hsl(var(--chart-2))" },
  { browser: "Goal Completion", visitors: 20, fill: "hsl(var(--chart-3))" },
  { browser: "Special Events", visitors: 20, fill: "hsl(var(--chart-4))" },
];

const milestones = [
  {
    title: "Elite Athlete",
    description: "Complete 100 workouts",
    icon: <Trophy className="h-3 w-3 sm:h-4 sm:w-4" />,
    progress: 85,
    points: 1000,
  },
  {
    title: "Dedication Master",
    description: "Maintain 60-day streak",
    icon: <Flame className="h-3 w-3 sm:h-4 sm:w-4" />,
    progress: 75,
    points: 2000,
  },
  {
    title: "Strength Champion",
    description: "Lift 10,000 kg total",
    icon: <Award className="h-3 w-3 sm:h-4 sm:w-4" />,
    progress: 60,
    points: 1500,
  },
  {
    title: "Endurance King",
    description: "Complete 50 cardio sessions",
    icon: <Star className="h-3 w-3 sm:h-4 sm:w-4" />,
    progress: 45,
    points: 1200,
  },
];

const chartConfig = {
  workouts: {
    label: "Workouts",
    color: "hsl(var(--chart-1))",
  },
  points: {
    label: "Points",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function Stats() {
  const [timeRange, setTimeRange] = React.useState("90d");

  return (
    <Card className="w-full p-4 space-y-4 md:p-6 md:space-y-6 border-none">
      <Card className="md:hidden p-4">
        <div className="flex items-center gap-3">
          <Info className="h-5 w-5 text-muted-foreground shrink-0" />
          <CardContent className="p-0 text-sm text-muted-foreground">
            For a better visualization of your stats, please use a desktop
            device
          </CardContent>
        </div>
      </Card>

      <div className="space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <div>
            <h2 className="text-lg font-semibold md:text-2xl">
              Achievement Analytics
            </h2>
            <p className="text-xs text-muted-foreground md:text-sm">
              Your fitness journey in numbers
            </p>
          </div>
          <div className="w-full md:w-auto text-left md:text-right">
            <p className="text-xs text-muted-foreground md:text-sm">
              Total Points
            </p>
            <p className="text-xl font-bold md:text-3xl">7,100</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="activity" className="space-y-4 md:space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="activity" className="text-xs md:text-sm">
            Activity
          </TabsTrigger>
          <TabsTrigger value="achievements" className="text-xs md:text-sm">
            Achievements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4 md:space-y-6">
          <Card>
            <div className="p-3 border-b md:p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h4 className="text-sm font-medium">Activity Overview</h4>
                  <p className="text-xs text-muted-foreground">Last 3 months</p>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-full md:w-[160px]">
                    <SelectValue placeholder="Last 3 months" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="90d">Last 3 months</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="p-3 md:p-4">
              <ChartContainer
                config={chartConfig}
                className="h-[200px] md:h-[300px]"
              >
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient
                      id="colorWorkouts"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-workouts)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-workouts)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorPoints"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-points)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-points)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                      });
                    }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => {
                          return new Date(value).toLocaleDateString("en-US", {
                            month: "long",
                          });
                        }}
                      />
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="workouts"
                    stackId="1"
                    stroke="var(--color-workouts)"
                    fill="url(#colorWorkouts)"
                  />
                  <Area
                    type="monotone"
                    dataKey="points"
                    stackId="1"
                    stroke="var(--color-points)"
                    fill="url(#colorPoints)"
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ChartContainer>
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-4">
              <div className="flex items-center pb-0">
                <h4 className="text-sm font-medium md:text-base">
                  Achievement Distribution
                </h4>
              </div>
              <ChartContainer
                config={chartConfig}
                className="h-[150px] md:h-[200px]"
              >
                <RadialBarChart
                  data={achievementBreakdown}
                  startAngle={-90}
                  endAngle={380}
                  innerRadius={20}
                  outerRadius={70}
                  barSize={12}
                >
                  <ChartTooltip
                    content={
                      <ChartTooltipContent hideLabel nameKey="browser" />
                    }
                  />
                  <RadialBar
                    dataKey="visitors"
                    background
                    label={{
                      position: "insideStart",
                      fill: "white",
                      fontSize: 8,
                    }}
                  />
                </RadialBarChart>
              </ChartContainer>
            </Card>

            <Card className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-medium md:text-base">
                  Current Level
                </h4>
                <Badge variant="secondary" className="text-xs">
                  Level 15
                </Badge>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs text-muted-foreground md:text-sm">
                  <span>Progress to Level 16</span>
                  <span>7,100 / 10,000 XP</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: "71%" }}
                  />
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {milestones.map((milestone, index) => (
              <Card
                key={index}
                className="p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-secondary p-2 rounded-full">
                    {milestone.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-xs font-medium md:text-sm">
                        {milestone.title}
                      </h4>
                      <Badge
                        variant="secondary"
                        className="text-[10px] md:text-xs"
                      >
                        {milestone.points} pts
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground mb-2 md:text-xs">
                      {milestone.description}
                    </p>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out"
                        style={{ width: `${milestone.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
