"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Calendar,
  Ruler,
  Weight,
  Cigarette,
  Wine,
  Cookie,
  Moon,
  Trophy,
} from "lucide-react";

export function ProfileSummary() {
  const profile = {
    full_name: "John Doe",
    start_date: "2024-01-01",
    height: 180,
    weight: 75,
    smoke: "Non-smoker",
    alcohol: "1-3",
    sugar: "low",
    sleep: "7-8 hours",
  };

  const daysSinceStart = Math.floor(
    (new Date().getTime() - new Date(profile.start_date).getTime()) /
      (1000 * 3600 * 24)
  );

  return (
    <Card className="w-full md:w-1/3">
      <CardHeader className="pb-1">
        <CardTitle className="flex items-center justify-between gap-1.5 text-lg">
          <div className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            {profile.full_name}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {daysSinceStart}d
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="grid gap-2">
          <div className="flex justify-between items-center rounded-md bg-muted p-2 text-sm">
            <div className="flex items-center gap-1.5">
              <Trophy className="h-3.5 w-3.5" />
              <span className="font-medium">Non-Smoker</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              Healthy!
            </Badge>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className="flex flex-col gap-0.5 rounded-md border p-2">
              <div className="flex items-center gap-1">
                <Ruler className="h-3.5 w-3.5" />
                <span className="text-xs text-muted-foreground">Height</span>
              </div>
              <div className="text-sm font-medium">{profile.height}cm</div>
            </div>

            <div className="flex flex-col gap-0.5 rounded-md border p-2">
              <div className="flex items-center gap-1">
                <Weight className="h-3.5 w-3.5" />
                <span className="text-xs text-muted-foreground">Weight</span>
              </div>
              <div className="text-sm font-medium">{profile.weight}kg</div>
            </div>

            <div className="flex flex-col gap-0.5 rounded-md border p-2">
              <div className="flex items-center gap-1">
                <Wine className="h-3.5 w-3.5" />
                <span className="text-xs text-muted-foreground">Alcohol</span>
              </div>
              <div className="text-sm font-medium">{profile.alcohol}</div>
            </div>

            <div className="flex flex-col gap-0.5 rounded-md border p-2">
              <div className="flex items-center gap-1">
                <Cookie className="h-3.5 w-3.5" />
                <span className="text-xs text-muted-foreground">Sugar</span>
              </div>
              <div className="text-sm font-medium">{profile.sugar}</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-md border p-2">
            <Moon className="h-3.5 w-3.5" />
            <div className="text-xs text-muted-foreground">Sleep:</div>
            <div className="text-sm font-medium">{profile.sleep}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
