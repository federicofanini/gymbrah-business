"use client";

import { athleteCodeCookieAction } from "@/actions/athlete-code-cookie";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";

export function Payment() {
  const [isOpen, setOpen] = useState(true);
  const athleteCodeAction = useAction(athleteCodeCookieAction, {
    onExecute: () => setOpen(false),
  });

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed z-50 inset-0 flex items-center justify-center",
        isOpen && "animate-in fade-in-0"
      )}
    >
      <div className="bg-background/80 fixed inset-0 backdrop-blur-sm" />
      <div className="relative z-50 flex flex-col space-y-4 w-[calc(100vw-16px)] max-w-[420px] border border-border p-4 bg-background rounded-lg shadow-lg">
        <div className="text-sm">Your athlete code is:</div>
        <div className="flex justify-end space-x-2">
          <Button className="h-6">Confirm</Button>
        </div>
      </div>
    </div>
  );
}
