"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createUserProfile, getUserFullName } from "./actions";
import Link from "next/link";

export default function OnboardingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch user's full name on component mount
    const fetchFullName = async () => {
      const name = await getUserFullName();
      if (name) {
        setFormData((prev) => ({ ...prev, fullName: name }));
      }
    };
    fetchFullName();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (!formData.fullName.trim()) {
        setError("Please enter your name");
        setIsSubmitting(false);
        return;
      }

      const result = await createUserProfile({
        fullName: formData.fullName.trim(),
      });

      if (result.success) {
        // Redirect immediately after successful save
        router.push("/dashboard");
        router.refresh(); // Refresh to ensure new data is loaded
      } else {
        setError("Failed to update profile. Please try again.");
        console.error("Error:", result?.error);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Error creating user profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Complete Your Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/*<div className="flex justify-center mb-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={formData.avatarUrl} alt="Profile picture" />
                <AvatarFallback>
                  {formData.fullName?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </div>*/}

            <div className="space-y-2">
              <Label htmlFor="fullName">How should we call you?</Label>
              <Input
                id="fullName"
                required
                placeholder="James Bond"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                disabled={isSubmitting}
              />
              {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Complete profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
