"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { addClient } from "@/actions/business/client/add-client";
import { addClientSubscription } from "@/actions/business/client/add-client-sub";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { toast } from "sonner";

export function AddClientDialog() {
  const [step, setStep] = useState(1);
  const [clientId, setClientId] = useState<string>("");
  const [open, setOpen] = useState(false);

  const { execute: executeAddClient, status: addClientStatus } = useAction(
    addClient,
    {
      onSuccess: (response) => {
        if (response?.data?.success) {
          setClientId(response.data.data.id);
          setStep(2);
          toast.success("Client added successfully");
        } else {
          toast.error("Failed to add client");
        }
      },
    }
  );

  const { execute: executeAddSubscription, status: addSubStatus } = useAction(
    addClientSubscription,
    {
      onSuccess: (response) => {
        if (response?.data?.success) {
          setOpen(false);
          setStep(1);
          toast.success("Subscription added successfully");
        } else {
          toast.error("Failed to add subscription");
        }
      },
    }
  );

  const handleClientSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    await executeAddClient({
      name: formData.get("name") as string,
      surname: formData.get("surname") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      birthDate: formData.get("birthDate") as string,
      gender: formData.get("gender") as "male" | "female" | "other",
    });
  };

  const handleSubscriptionSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    await executeAddSubscription({
      clientId,
      subType: formData.get("subType") as
        | "monthly"
        | "bimestral"
        | "trimestral"
        | "quadrimestral"
        | "semestral"
        | "yearly",
      paymentDate: formData.get("paymentDate") as string,
      renewalDate: formData.get("renewalDate") as string,
      monthsPaid: formData.get("monthsPaid") as string,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Add New Client</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? "Add New Client" : "Set Client Subscription"}
          </DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <form onSubmit={handleClientSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="surname">Surname</Label>
                <Input id="surname" name="surname" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Birth Date</Label>
              <Input id="birthDate" name="birthDate" type="date" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select name="gender" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={addClientStatus === "executing"}
              className="w-full"
            >
              {addClientStatus === "executing" ? "Adding..." : "Next"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSubscriptionSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subType">Subscription Type</Label>
              <Select name="subType" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select subscription type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="bimestral">Bimestral</SelectItem>
                  <SelectItem value="trimestral">Trimestral</SelectItem>
                  <SelectItem value="quadrimestral">Quadrimestral</SelectItem>
                  <SelectItem value="semestral">Semestral</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentDate">Payment Date</Label>
              <Input
                id="paymentDate"
                name="paymentDate"
                type="date"
                defaultValue={format(new Date(), "yyyy-MM-dd")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="renewalDate">Renewal Date</Label>
              <Input id="renewalDate" name="renewalDate" type="date" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthsPaid">Months Paid</Label>
              <Input
                id="monthsPaid"
                name="monthsPaid"
                placeholder="e.g. 1,2,3"
                required
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button type="submit" disabled={addSubStatus === "executing"}>
                {addSubStatus === "executing" ? "Adding..." : "Complete"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
