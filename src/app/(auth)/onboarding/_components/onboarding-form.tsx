"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Athlete } from "./athlete";
import OnboardingPage from "./business";

export function OnboardingForm() {
  const [selectedTab, setSelectedTab] = useState("business");

  return (
    <div className="w-full max-w-3xl mx-auto h-screen flex items-center justify-center p-2">
      <Tabs
        defaultValue="athlete"
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="athlete">Athlete</TabsTrigger>
          <TabsTrigger value="business">Gyms & PT</TabsTrigger>
        </TabsList>
        <TabsContent value="athlete" className="mt-6">
          <Athlete />
        </TabsContent>
        <TabsContent value="business" className="mt-6">
          <OnboardingPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
