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
  SearchIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Link from "next/link";

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
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = mockClients.filter((client) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      client.fullName.toLowerCase().includes(searchLower) ||
      client.subscriptionType.toLowerCase().includes(searchLower)
    );
  });

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
    <div className="space-y-8">
      <div className="w-full border border-border rounded-lg">
        <div className="p-3 md:p-6 flex flex-col md:flex-row md:justify-between md:items-center border-b gap-3 md:gap-0">
          <div className="space-y-1">
            <h2 className="text-base md:text-lg font-medium">Gym Clients</h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              Manage your gym members and their subscriptions
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative w-full md:max-w-sm">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                className="pl-8 w-full md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="w-full sm:w-auto" variant="outline" size="sm">
              <PlusCircleIcon className="mr-2 size-4" />
              Add Client
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto px-2 py-1 md:px-6 md:py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[100px] md:min-w-[120px]">
                  Full Name
                </TableHead>
                <TableHead className="hidden md:table-cell min-w-[100px]">
                  Subscription
                </TableHead>
                <TableHead className="min-w-[100px]">Expiration</TableHead>
                <TableHead className="hidden md:table-cell min-w-[80px] md:min-w-[100px]">
                  Status
                </TableHead>
                <TableHead className="text-right min-w-[100px] md:min-w-[160px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => {
                const expiration = getExpirationStatus(client.expirationDate);

                return (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">
                      {client.fullName}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="whitespace-nowrap">
                        {client.subscriptionType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={expiration.variant as any}
                        className="whitespace-nowrap"
                      >
                        {expiration.text}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge
                        variant={client.isConnected ? "success" : "destructive"}
                        className="whitespace-nowrap"
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
                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                        className="sm:hidden"
                      >
                        <Link href={`/business/clients/${client.id}`}>
                          <UserIcon className="size-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="hidden sm:inline-flex whitespace-nowrap"
                      >
                        <Link href={`/business/clients/${client.id}`}>
                          <UserIcon className="mr-2 size-4" />
                          Client Page
                        </Link>
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
    </div>
  );
}
