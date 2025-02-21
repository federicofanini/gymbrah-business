"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { seedExercises } from "@/actions/exercises/seed";

export function SeedExercises() {
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      const result = await seedExercises();

      if (!result?.data?.success) {
        throw new Error(result?.data?.error || "Failed to seed exercises");
      }

      toast.success("Successfully seeded exercises");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to seed exercises"
      );
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Seed Exercises</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Populate the database with exercise data from the external API.
      </p>
      <Button onClick={handleSeed} disabled={isSeeding}>
        {isSeeding ? (
          <>
            <Spinner size="sm" className="mr-2" />
            Seeding Exercises...
          </>
        ) : (
          "Seed Exercises"
        )}
      </Button>
    </Card>
  );
}
