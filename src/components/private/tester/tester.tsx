"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { addTesterAction, getTesterCounts } from "../settings/admin/tester";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface TesterCounts {
  business: {
    current: number;
    maximum: number;
    spotsLeft: number;
  };
  athlete: {
    current: number;
    maximum: number;
    spotsLeft: number;
  };
}

export function Tester() {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [counts, setCounts] = useState<TesterCounts | null>(null);

  const fetchCounts = async () => {
    try {
      const result = await getTesterCounts();
      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to fetch tester counts");
      }
      setCounts(result.data as TesterCounts);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch tester counts"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const result = await addTesterAction({ email, role: "business" });
      if (!result?.data?.success) {
        throw new Error(result?.data?.error || "Failed to add tester");
      }
      setEmail("");
      toast.success("Successfully joined the beta!");
      fetchCounts();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add tester"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const isDisabled = !counts || counts.business.spotsLeft <= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="flex flex-col items-center gap-6 w-full max-w-[320px] sm:max-w-lg text-center">
        <h2 className="text-2xl sm:text-3xl font-bold font-mono">
          Join Our Beta Program
        </h2>
        <p className="text-muted-foreground text-base sm:text-lg">
          Be among the first to experience our revolutionary gym tracking
          platform.
          <br />
          Limited spots available for early access.
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 w-full">
            <Skeleton className="h-24 rounded-lg" />
          </div>
        ) : (
          <div className="w-full">
            <div className="text-center p-4 border rounded-lg bg-primary/5">
              <p className="text-sm text-muted-foreground mb-2">
                Available Business Spots
              </p>
              <p className="text-2xl font-bold text-primary">
                {counts?.business.spotsLeft} / {counts?.business.maximum}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground"
            disabled={isSaving || isDisabled}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Image
                src="/logo/logo_white.svg"
                alt="Logo"
                width={16}
                height={16}
                className="mr-2"
              />
            )}
            Join Beta Program
          </Button>
          <p className="text-sm font-semibold text-red-500">
            Refresh the page after entering your email to get access to the app.
          </p>
        </form>

        <div className="text-xs sm:text-sm text-muted-foreground flex flex-col items-center gap-2 mt-4">
          <p className="text-center max-w-[280px] sm:max-w-sm">
            Join us in shaping the future of gym management and training. Your
            feedback matters!
          </p>
          <p className="text-center mt-4">Questions or need assistance?</p>
          <Link
            href="https://twitter.com/FedericoFan"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium inline-flex items-center gap-1.5"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-3 sm:size-4"
              fill="currentColor"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>Follow us @FedericoFan</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
