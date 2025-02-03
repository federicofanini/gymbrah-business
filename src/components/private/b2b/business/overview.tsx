"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  UsersIcon,
  DollarSignIcon,
  ActivityIcon,
} from "lucide-react";

export function Overview() {
  const stats = [
    {
      title: "Total Members",
      value: "247",
      change: "+12%",
      isPositive: true,
      icon: UsersIcon,
    },
    {
      title: "Monthly Revenue",
      value: "$8,742",
      change: "+8%",
      isPositive: true,
      icon: DollarSignIcon,
    },
    {
      title: "Active Sessions",
      value: "1,432",
      change: "-3%",
      isPositive: false,
      icon: ActivityIcon,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <Badge
                    variant={stat.isPositive ? "success" : "destructive"}
                    className="text-xs"
                  >
                    {stat.isPositive ? (
                      <ArrowUpIcon className="mr-1 size-3" />
                    ) : (
                      <ArrowDownIcon className="mr-1 size-3" />
                    )}
                    {stat.change}
                  </Badge>
                </div>
              </div>
              <stat.icon className="size-8 text-muted-foreground" />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-medium mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              "Sarah Johnson checked in at 9:15 AM",
              "New member registration: Mike Wilson",
              "Monthly payment received from John Smith",
              "Class 'Advanced HIIT' is fully booked",
              "Equipment maintenance scheduled for tomorrow",
            ].map((activity, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <div className="size-2 rounded-full bg-primary" />
                {activity}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-medium mb-4">Upcoming Classes</h3>
          <div className="space-y-4">
            {[
              { name: "Morning Yoga", time: "7:00 AM", spots: "3 spots left" },
              { name: "CrossFit Basics", time: "9:30 AM", spots: "Full" },
              { name: "Spinning", time: "12:00 PM", spots: "8 spots left" },
              { name: "Boxing", time: "5:30 PM", spots: "2 spots left" },
              { name: "Evening HIIT", time: "7:00 PM", spots: "5 spots left" },
            ].map((cls, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{cls.name}</p>
                  <p className="text-sm text-muted-foreground">{cls.time}</p>
                </div>
                <Badge
                  variant={cls.spots === "Full" ? "destructive" : "secondary"}
                >
                  {cls.spots}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
