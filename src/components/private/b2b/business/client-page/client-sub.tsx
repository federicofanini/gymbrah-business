"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MdAttachMoney, MdCalendarToday, MdAutorenew } from "react-icons/md";
import { format } from "date-fns";

interface ClientSubProps {
  client: {
    name: string;
    surname: string;
    subscription: {
      sub_type: string;
      payment_date: Date;
      renewal_date: Date;
      months_paid: number;
    } | null;
  };
}

export function ClientSub({ client }: ClientSubProps) {
  const subscription = client.subscription;

  const subscriptionDetails = [
    {
      title: "Subscription Type",
      value: subscription?.sub_type || "No active subscription",
      icon: MdAttachMoney,
    },
    {
      title: "Last Payment",
      value: subscription?.payment_date
        ? format(new Date(subscription.payment_date), "MMM d, yyyy")
        : "N/A",
      icon: MdCalendarToday,
    },
    {
      title: "Next Renewal",
      value: subscription?.renewal_date
        ? format(new Date(subscription.renewal_date), "MMM d, yyyy")
        : "N/A",
      icon: MdAutorenew,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        {subscriptionDetails.map((detail) => (
          <Card key={detail.title} className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {detail.title}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold capitalize">
                    {detail.value}
                  </p>
                </div>
              </div>
              <detail.icon className="size-8 text-muted-foreground" />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-medium mb-4">Payment History</h3>
          <div className="space-y-4">
            {subscription ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {subscription.months_paid} Month
                    {subscription.months_paid > 1 ? "s" : ""} Subscription
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(subscription.payment_date), "MMM d, yyyy")}
                  </p>
                </div>
                <Badge variant="success">Paid</Badge>
              </div>
            ) : (
              <p className="text-muted-foreground">
                No payment history available
              </p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-medium mb-4">Subscription Details</h3>
          <div className="space-y-4">
            {subscription ? (
              <>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">
                    {subscription.months_paid} Month
                    {subscription.months_paid > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium capitalize">
                    {subscription.sub_type}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">No active subscription</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
