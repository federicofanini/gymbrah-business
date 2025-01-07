"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { bulkAddExercises } from "@/actions/admin/add-exercise";
import { type ActionResponse } from "@/actions/types/action-response";

export function BulkAddExercisesButton() {
  async function handleBulkAdd() {
    try {
      const result = await bulkAddExercises();

      if (!result) {
        throw new Error("No response from server");
      }

      if (result.data) {
        const response = result.data as ActionResponse;
        if (response.success) {
          toast.success("Successfully added all exercises to the database");
        } else {
          toast.error(response.error || "Failed to add exercises");
        }
      }
    } catch (error) {
      console.error("Bulk add exercises error:", error);
      toast.error("Failed to add exercises");
    }
  }

  return (
    <Button onClick={handleBulkAdd} className="w-full">
      Bulk Add All Exercises
    </Button>
  );
}
