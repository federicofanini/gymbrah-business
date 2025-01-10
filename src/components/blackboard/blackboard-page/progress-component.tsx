"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Trophy, Flame, Target, TrendingUp, Calendar } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Mock data - Replace with real data from your backend
const weeklyProgress = [
  { day: "Mon", completed: 4, total: 5 },
  { day: "Tue", completed: 5, total: 5 },
  { day: "Wed", completed: 3, total: 5 },
  { day: "Thu", completed: 5, total: 5 },
  { day: "Fri", completed: 4, total: 5 },
  { day: "Sat", completed: 2, total: 5 },
  { day: "Sun", completed: 0, total: 5 },
];

const monthlyTrend = [
  { week: "W1", workouts: 15 },
  { week: "W2", workouts: 18 },
  { week: "W3", workouts: 12 },
  { week: "W4", workouts: 20 },
];

const achievements = [
  {
    title: "Perfect Week",
    description: "Completed all workouts for 7 days straight",
    icon: <Trophy className="h-3 w-3 sm:h-4 sm:w-4" />,
    progress: 85,
  },
  {
    title: "Consistency King",
    description: "Workout streak of 30 days",
    icon: <Flame className="h-3 w-3 sm:h-4 sm:w-4" />,
    progress: 60,
  },
  {
    title: "Goal Crusher",
    description: "Reached monthly workout target",
    icon: <Target className="h-3 w-3 sm:h-4 sm:w-4" />,
    progress: 90,
  },
];

const chartConfig = {
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function ProgressComponent() {
  return (
    <Card className="w-full p-2.5 sm:p-4 space-y-2.5 sm:space-y-4">
      <div className="space-y-1 sm:space-y-2">
        <h2 className="text-sm sm:text-xl font-semibold">Progress Overview</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Track your fitness journey
        </p>
      </div>

      <Tabs defaultValue="weekly" className="space-y-2.5 sm:space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="weekly" className="text-xs sm:text-sm">
            Weekly
          </TabsTrigger>
          <TabsTrigger value="monthly" className="text-xs sm:text-sm">
            Monthly
          </TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-2.5 sm:space-y-4">
          <div className="h-[150px] sm:h-[200px] w-full mb-8">
            <div className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">
              Completed Workouts
            </div>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyProgress}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    className="text-xs sm:text-sm"
                  />
                  <YAxis
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    className="text-xs sm:text-sm"
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar
                    dataKey="completed"
                    fill="hsl(var(--chart-2))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div className="flex justify-between items-center mt-8">
            <div className="space-y-1.5 sm:space-y-1">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                Weekly Target
              </p>
              <p className="text-base sm:text-2xl font-bold">23/35</p>
            </div>
            <Badge
              variant="secondary"
              className="flex gap-1 text-[10px] sm:text-xs"
            >
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Week 32</span>
            </Badge>
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-2.5 sm:space-y-4">
          <div className="h-[150px] sm:h-[200px] w-full mb-8">
            <div className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">
              Monthly Trend
            </div>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrend}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="week"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    className="text-xs sm:text-sm"
                  />
                  <YAxis
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    className="text-xs sm:text-sm"
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Line
                    type="monotone"
                    dataKey="workouts"
                    stroke="hsl(var(--primary))"
                    strokeWidth={1.5}
                    dot={{ fill: "hsl(var(--primary))", r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div className="flex justify-between items-center mt-8">
            <div className="space-y-0.5 sm:space-y-1">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                Monthly Progress
              </p>
              <div className="flex items-center gap-2">
                <p className="text-base sm:text-2xl font-bold">65</p>
                <Badge
                  variant="secondary"
                  className="flex gap-1 text-[10px] sm:text-xs"
                >
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>+12%</span>
                </Badge>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-2.5 sm:space-y-4">
        <h3 className="text-sm sm:text-lg font-semibold">Achievements</h3>
        <div className="space-y-2 sm:space-y-4">
          {achievements.map((achievement, index) => (
            <div key={index} className="flex items-center gap-2 sm:gap-4">
              <div className="bg-secondary p-1.5 sm:p-2 rounded-full">
                {achievement.icon}
              </div>
              <div className="flex-1 space-y-0.5 sm:space-y-1">
                <p className="text-xs sm:text-sm font-medium">
                  {achievement.title}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  {achievement.description}
                </p>
                <div className="h-1.5 sm:h-2 bg-secondary rounded-full">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${achievement.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
