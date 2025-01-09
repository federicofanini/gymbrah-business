"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition } from "react";
import { revalidateFeedbackCache } from "@/actions/feedback/feedback";

export function HardUpdate() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleRefresh = async () => {
    startTransition(async () => {
      try {
        const result = await revalidateFeedbackCache();

        if (!result.success) {
          throw new Error(result.error);
        }

        // Force a hard refresh of the page data
        router.refresh();
        toast.success("Feedback refreshed successfully");
      } catch (error) {
        console.error("Refresh error:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to refresh feedback"
        );
      }
    });
  };

  return (
    <Button variant="secondary" onClick={handleRefresh} disabled={isPending}>
      <RefreshCw
        className={`mr-2 h-4 w-4 ${isPending ? "animate-spin" : ""}`}
      />
      {isPending ? "Refreshing..." : "Refresh"}
    </Button>
  );
}
