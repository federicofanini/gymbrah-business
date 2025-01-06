"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Dumbbell, PersonStanding, Zap } from "lucide-react";

interface WorkoutSession {
  title: string;
  duration: string;
  points: number;
  muscleGroups: string[];
  equipment: string;
  progress: number;
  totalSessions: number;
}

const mockWorkout: WorkoutSession = {
  title: "FORZA",
  duration: "25 min",
  points: 660,
  muscleGroups: ["Busto", "Parte inferiore del corpo", "Glutei", "Cosce"],
  equipment: "Manubrio",
  progress: 5,
  totalSessions: 18,
};

export function WorkoutCard() {
  return (
    <Card className="w-full p-2.5 sm:p-4 space-y-2.5 sm:space-y-4 bg-[#1a2e35] text-white">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1.5 sm:gap-4">
        <div className="space-y-1.5 sm:space-y-3 flex justify-between gap-2 items-center">
          <h2 className="text-base sm:text-2xl font-semibold line-clamp-2">
            {mockWorkout.title}
          </h2>
          <div className="flex flex-wrap gap-2 sm:gap-4 text-[11px] sm:text-sm text-gray-300">
            <div className="flex items-center gap-1 sm:gap-2">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              {mockWorkout.duration}
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
              {mockWorkout.points} punti
            </div>
          </div>
        </div>
        <div className="text-[11px] sm:text-sm text-gray-300 sm:text-right">
          {mockWorkout.progress} di {mockWorkout.totalSessions} sessioni
        </div>
      </div>

      <div className="space-y-1.5 sm:space-y-3">
        <div className="flex items-center gap-1 sm:gap-2 text-[11px] sm:text-sm">
          <PersonStanding className="h-3 w-3 sm:h-4 sm:w-4" />
          <ScrollArea className="w-full">
            <div className="flex gap-1 sm:gap-2">
              {mockWorkout.muscleGroups.map((group, index) => (
                <span key={index} className="whitespace-nowrap">
                  {index > 0 && ", "}
                  {group}
                </span>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 text-[11px] sm:text-sm">
          <Dumbbell className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          {mockWorkout.equipment}
        </div>
      </div>
    </Card>
  );
}
