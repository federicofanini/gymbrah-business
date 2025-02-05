"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { addBusinessPlan } from "@/actions/business/onboarding/add-business-plan";
import { saveUser } from "@/actions/user/save-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function Athlete() {
  const router = useRouter();

  // Plan Form State
  // TODO: replace with stripe payment
  const [planForm, setPlanForm] = useState({
    stripeCustomerId: "",
    stripeSubscriptionId: "",
    stripePriceId: "",
    planName: "",
  });

  const { execute: executeAddBusinessPlan, status: addPlanStatus } = useAction(
    addBusinessPlan,
    {
      onSuccess: (response) => {
        if (response?.data?.success) {
          toast.success("Business plan added successfully");
          executeCreateUser();
        } else {
          toast.error("Failed to add business plan");
        }
      },
    }
  );

  const { execute: executeCreateUser } = useAction(saveUser, {
    onSuccess: (response) => {
      if (response?.data) {
        router.push("/athlete");
      } else {
        toast.error("Failed to create user");
      }
    },
  });

  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeAddBusinessPlan(planForm);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Athlete Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePlanSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="planName">Plan Name</Label>
            <Input
              id="planName"
              value={planForm.planName}
              onChange={(e) =>
                setPlanForm({ ...planForm, planName: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stripeCustomerId">Stripe Customer ID</Label>
            <Input
              id="stripeCustomerId"
              value={planForm.stripeCustomerId}
              onChange={(e) =>
                setPlanForm({
                  ...planForm,
                  stripeCustomerId: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stripeSubscriptionId">Stripe Subscription ID</Label>
            <Input
              id="stripeSubscriptionId"
              value={planForm.stripeSubscriptionId}
              onChange={(e) =>
                setPlanForm({
                  ...planForm,
                  stripeSubscriptionId: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stripePriceId">Stripe Price ID</Label>
            <Input
              id="stripePriceId"
              value={planForm.stripePriceId}
              onChange={(e) =>
                setPlanForm({ ...planForm, stripePriceId: e.target.value })
              }
              required
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={addPlanStatus === "executing"}
            >
              {addPlanStatus === "executing"
                ? "Saving..."
                : "Complete Onboarding"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
