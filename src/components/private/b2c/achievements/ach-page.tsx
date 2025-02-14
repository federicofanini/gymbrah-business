"use client";

import { ACHIEVEMENTS } from "@/actions/achievements/thresholds";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Medal, Flame, Dumbbell, Trophy, Star, Share } from "lucide-react";
import Image from "next/image";
import { MdShare } from "react-icons/md";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AchievementsPageProps {
  data: {
    currentPoints: number;
    currentLevel: number;
    currentStreak: number;
    longestStreak: number;
    workoutsCompleted: number;
    totalSets: number;
    achievements: string[];
    badges: string[];
    lastWorkoutDate: Date | null;
    currentXP: number;
    next_level_xp: number;
  };
  profile: {
    full_name: string;
    avatar_url: string;
  };
}

export function AchievementsPage({ data, profile }: AchievementsPageProps) {
  const xpProgress =
    (data.currentXP / (data.next_level_xp + data.currentXP)) * 100;

  return (
    <Card className=" px-4 md:px-8 py-4 mx-8">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
          <div className="flex  md:flex-row md:items-center gap-4">
            <div className="relative h-12 w-12 rounded-full overflow-hidden">
              <Image
                src={profile.avatar_url}
                alt={profile.full_name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-1">
              <div className="flex items-center gap-1">
                <h1 className="text-lg font-semibold">{profile.full_name}</h1>
                <Button variant="ghost" className="size-6">
                  <MdShare className="size-3.5" />
                </Button>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-400" />
                Level {data.currentLevel}
                <Progress value={xpProgress} className="h-1.5 w-24 ml-2" />
                <span className="text-xs ml-2">
                  {data.currentXP}/{data.next_level_xp + data.currentXP} XP
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-center md:justify-start gap-2">
            <TooltipProvider>
              {data.badges.map((badgeId, index) => {
                const badgeInfo = Object.values(ACHIEVEMENTS)
                  .flatMap((category) => Object.values(category))
                  .find((achievement) => achievement.badge === badgeId);

                if (!badgeInfo) return null;

                return (
                  <Tooltip key={`badge-${index}`}>
                    <TooltipTrigger>
                      <div className="relative overflow-hidden">
                        <Image
                          src={badgeInfo.img}
                          alt={badgeInfo.name}
                          width={32}
                          height={32}
                          className="object-fill"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{badgeInfo.name}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
              {data.achievements.map((achievementId, index) => {
                const achievementInfo = Object.values(ACHIEVEMENTS)
                  .flatMap((category) => Object.values(category))
                  .find((achievement) => achievement.id === achievementId);

                if (!achievementInfo) return null;

                return (
                  <Tooltip key={`achievement-${index}`}>
                    <TooltipTrigger>
                      <div className="relative overflow-hidden">
                        <Image
                          src={achievementInfo.img}
                          alt={achievementInfo.name}
                          width={32}
                          height={32}
                          className="object-fill"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{achievementInfo.name}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </TooltipProvider>
          </div>

          <div className="grid grid-cols-3 md:flex justify-center gap-4 md:gap-6 md:mt-0 text-center">
            <div className="grid items-center gap-2 text-center">
              <div className="text-xs text-muted-foreground">Streak</div>
              <div className="text-sm flex items-center gap-1 justify-center">
                <Flame className="size-4 text-orange-500" />
                <div className="font-semibold">{data.currentStreak}</div>
              </div>
            </div>
            <div className="grid items-center gap-2">
              <div className="text-xs text-muted-foreground">Workouts</div>
              <div className="text-sm flex items-center gap-1 justify-center">
                <Dumbbell className="size-4 text-cyan-500" />
                <div className="font-semibold">{data.workoutsCompleted}</div>
              </div>
            </div>
            <div className="grid items-center gap-2">
              <div className="text-xs text-muted-foreground">Best</div>
              <div className="text-sm flex items-center gap-1 justify-center">
                <Trophy className="size-4 text-yellow-500" />
                <div className="font-semibold">{data.longestStreak}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
