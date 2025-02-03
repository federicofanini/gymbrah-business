"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  PlusCircleIcon,
  UserIcon,
  TrashIcon,
  XIcon,
  CheckIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockClients = [
  {
    id: "1",
    fullName: "John Smith",
    subscriptionType: "Monthly",
    expirationDate: "2024-03-15",
    isConnected: true,
  },
  {
    id: "2",
    fullName: "Sarah Johnson",
    subscriptionType: "Quarterly",
    expirationDate: "2025-05-03",
    isConnected: false,
  },
  {
    id: "3",
    fullName: "Mike Wilson",
    subscriptionType: "Annual",
    expirationDate: "2025-02-07",
    isConnected: true,
  },
];

export function Clients() {
  const getExpirationStatus = (date: string) => {
    const expirationDate = new Date(date);
    const today = new Date();
    const daysUntilExpiration = Math.ceil(
      (expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilExpiration < 0)
      return { variant: "destructive", text: "Expired" };
    if (daysUntilExpiration <= 7)
      return {
        variant: "warning" as const,
        text: `${daysUntilExpiration}d left`,
      };
    return {
      variant: "secondary" as const,
      text: expirationDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }),
    };
  };

  return (
    <div className="w-full border border-border rounded-lg">
      <div className="p-4 flex justify-between items-center border-b">
        <div className="space-y-1">
          <h2 className="text-lg font-medium">Gym Clients</h2>
          <p className="text-sm text-muted-foreground">
            Manage your gym members and their subscriptions
          </p>
        </div>
        <Button variant="outline" size="sm">
          <PlusCircleIcon className="mr-2 size-4" />
          Add Client
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Subscription Type</TableHead>
              <TableHead>Expiration Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockClients.map((client) => {
              const expiration = getExpirationStatus(client.expirationDate);

              return (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">
                    {client.fullName}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{client.subscriptionType}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={expiration.variant as any}>
                      {expiration.text}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={client.isConnected ? "success" : "destructive"}
                    >
                      {client.isConnected ? (
                        <CheckIcon className="size-3.5 mr-1" />
                      ) : (
                        <XIcon className="size-3.5 mr-1" />
                      )}
                      {client.isConnected ? "Connected" : "Not Connected"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm">
                      <UserIcon className="mr-2 size-4" />
                      Athlete Page
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive/90"
                    >
                      <TrashIcon className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
