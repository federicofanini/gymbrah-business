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
    <Tabs value={tab} onValueChange={setTab} className="w-full px-8">
      <div className="flex items-center justify-between mb-4 mt-2 max-w-screen-xl">
        <TabsList className="justify-start rounded-none h-auto p-0 bg-transparent space-x-6">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="rounded-none border-b-2 border-transparent text-primary data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2"
            >
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value="overview">
        <Overview />
      </TabsContent>

      <TabsContent value="clients">
        <Clients />
      </TabsContent>
    </Tabs>
  );
}
