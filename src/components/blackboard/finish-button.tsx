"use client";

import { Button } from "@/components/ui/button";
import { Circle, CheckCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { useState } from "react";

interface FinishButtonProps {
  onClick?: () => void;
}

export function FinishButton({ onClick }: FinishButtonProps) {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleClick = () => {
    setIsCompleted(true);
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
    });
    onClick?.();
  };

  return (
    <Button
      className="w-full gap-2"
      size="lg"
      onClick={handleClick}
      variant={isCompleted ? "default" : "secondary"}
    >
      {isCompleted ? (
        <CheckCircle className="h-5 w-5" />
      ) : (
        <Circle className="h-5 w-5" />
      )}
      Complete Workout
    </Button>
  );
}
