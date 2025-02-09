"use client";

import { useEffect, useState } from "react";
import { getAthleteCode } from "@/actions/athlete/athlete-code";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export function AthleteCodeDisplay() {
  const [code, setCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBusinessCode() {
      try {
        const response = await getAthleteCode();
        if (response?.data?.success) {
          setCode(response.data.data.athlete_code);
        }
      } catch (error) {
        console.error("Error fetching business code:", error);
        toast.error("Failed to load business code");
      } finally {
        setIsLoading(false);
      }
    }

    fetchBusinessCode();
  }, []);

  console.log("code", code);

  const copyToClipboard = async () => {
    if (!code) return;

    try {
      await navigator.clipboard.writeText(code);
      toast.success("Athlete code copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy code");
    }
  };

  if (isLoading) {
    return <div className="animate-pulse h-6 w-32 bg-muted rounded" />;
  }

  if (!code) {
    return (
      <div className="text-muted-foreground">No athlete code available</div>
    );
  }

  return (
    <div className="flex items-center gap-2 border border-border rounded-md px-2 py-1">
      <span className="font-mono text-lg">Athlete</span>
      <span className="font-mono text-lg">{code}</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={copyToClipboard}
        className="h-8 w-8"
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
}
