"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryState } from "nuqs";
import { Overview } from "./overview";
import { Clients } from "./clients";

export function BusinessPage() {
  const [tab, setTab] = useQueryState("tab", {
    defaultValue: "overview",
  });

  const tabs = [
    {
      id: "overview",
      title: "Overview", // TODO: translate
    },
    {
      id: "clients",
      title: "Clients", // TODO: translate
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

        <TabsContent value="overview" className="mt-6">
          <Overview />
        </TabsContent>

        <TabsContent value="clients" className="mt-6">
          <Clients />
        </TabsContent>
      </Tabs>
    </div>
  );
}
