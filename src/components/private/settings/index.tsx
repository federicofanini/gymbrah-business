"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryState } from "nuqs";
import { BusinessDetails, BusinessFormData } from "./business-details";

export function SettingsPage({
  businessDetails,
}: {
  businessDetails: BusinessFormData;
}) {
  const [tab, setTab] = useQueryState("tab", {
    defaultValue: "business-details",
  });

  const tabs = [
    {
      id: "business-details",
      title: "Business Details",
    },
    {
      id: "plan",
      title: "Plan",
    },
  ];

  return (
    <div className="w-full px-4 md:px-8 py-4">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="justify-start rounded-none h-auto p-0 bg-transparent space-x-4 md:space-x-6 overflow-x-auto">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="rounded-none border-b-2 border-transparent text-primary data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2 text-sm md:text-base whitespace-nowrap"
            >
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="business-details" className="mt-6">
          <BusinessDetails initialData={businessDetails} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
