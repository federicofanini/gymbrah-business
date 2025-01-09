"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTransition } from "react";
import { selectWorkout } from "@/actions/workout/select-workout";
import { deleteWorkout } from "@/actions/workout/delete-workout";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LogEvents } from "@/utils/events/events";
import { setupAnalytics } from "@/utils/events/server";
import { getUserMetadata } from "@/utils/supabase/database/cached-queries";

interface WorkoutActionsProps {
  workout: {
    id: string;
    selected: boolean;
  };
}

export function WorkoutActions({ workout }: WorkoutActionsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = () => {
    startTransition(async () => {
      const result = await selectWorkout({
        workoutId: !workout.selected ? workout.id : "",
      });

      if (!result?.data?.success) {
        toast.error("Failed to update workout selection");
        return;
      }

      const analytics = await setupAnalytics();
      analytics.track({
        event: LogEvents.WorkoutSelected.name(
          (await getUserMetadata())?.full_name
        ),
        channel: LogEvents.WorkoutSelected.channel,
        page: "workouts",
      });

      router.refresh();
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteWorkout({
        workoutId: workout.id,
      });

      if (!result?.data?.success) {
        toast.error("Failed to delete workout");
        return;
      }

      const analytics = await setupAnalytics();
      analytics.track({
        event: LogEvents.WorkoutDeleted.name(
          (await getUserMetadata())?.full_name
        ),
        channel: LogEvents.WorkoutDeleted.channel,
        page: "workouts",
      });

      toast.success("Workout deleted successfully");
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-3 touch-manipulation">
      <div className="relative min-w-[36px] min-h-[24px]">
        <Switch
          checked={workout.selected}
          onCheckedChange={handleToggle}
          disabled={isPending}
          aria-label="Toggle workout selection"
          className="touch-manipulation"
        />
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        disabled={isPending}
        className="text-red-500 hover:bg-red-500/10 relative min-w-[40px] min-h-[40px] touch-manipulation"
        aria-label="Delete workout"
      >
        {isPending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Trash2 className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}
