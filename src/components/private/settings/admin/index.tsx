"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryState } from "nuqs";
import { Testers } from "./tester-page";

interface Tester {
  id: string;
  email: string;
  created_at: Date;
}

export function SettingsAdminPage({ testers }: { testers: Tester[] }) {
  const [tab, setTab] = useQueryState("tab", {
    defaultValue: "testers",
  });

  const tabs = [
    {
      id: "testers",
      title: "Testers",
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

        <TabsContent value="testers" className="mt-6">
          <Testers testers={testers} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
