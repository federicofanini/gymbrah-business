"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTransition } from "react";
import { selectWorkout } from "@/actions/workout/select-workout";
import { deleteWorkout } from "@/actions/workout/delete-workout";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

      toast.success("Workout deleted successfully");
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Switch
          checked={workout.selected}
          onCheckedChange={handleToggle}
          disabled={isPending}
          aria-label="Toggle workout selection"
        />
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        disabled={isPending}
        className="text-red-500 hover:bg-red-500/10 relative"
        aria-label="Delete workout"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
