"use client";

import { useState } from "react";
import { seedExercises } from "@/actions/exercises/seed";
import { Button } from "@/components/ui/button";

export default function WebsitePage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSeed = async () => {
    setIsLoading(true);
    setLogs(["Starting exercise seeding..."]);

    try {
      const result = await seedExercises();

      if (result?.data?.success) {
        setLogs((prev) => [
          ...prev,
          `Successfully seeded ${result?.data?.data?.length} exercises`,
        ]);
      } else {
        setLogs((prev) => [...prev, `Error: ${result?.data?.error}`]);
      }
    } catch (error) {
      setLogs((prev) => [...prev, `Unexpected error occurred: ${error}`]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-8">
      <h1 className="text-2xl font-bold">Website page coming soon</h1>

      <Button onClick={handleSeed} disabled={isLoading} className="w-48">
        {isLoading ? "Seeding..." : "Seed Exercises"}
      </Button>

      {logs.length > 0 && (
        <div className="w-full max-w-lg p-4 space-y-2 border rounded-lg bg-muted">
          <h2 className="font-semibold">Logs:</h2>
          {logs.map((log, index) => (
            <p key={index} className="text-sm">
              {log}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
