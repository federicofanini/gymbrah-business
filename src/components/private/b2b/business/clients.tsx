"use client";

import { useEffect } from "react";
import { useAction } from "next-safe-action/hooks";
import { useQueryState } from "nuqs";
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
  UserIcon,
  TrashIcon,
  XIcon,
  CheckIcon,
  SearchIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { AddClientDialog } from "./add-client";
import { getClients } from "@/actions/business/client/get-clients";
import { GetClientsResponse } from "@/actions/business/client/get-clients";
import { Skeleton } from "@/components/ui/skeleton";

export function Clients() {
  const [page, setPage] = useQueryState("page", {
    defaultValue: 1,
    parse: (value) => parseInt(value),
  });
  const [searchQuery, setSearchQuery] = useQueryState("search", {
    defaultValue: "",
  });

  const {
    execute: fetchClients,
    result: clientsData,
    status,
  } = useAction(getClients);

  useEffect(() => {
    fetchClients({
      page: page,
      limit: 10,
    });
  }, [page, fetchClients]);

  const getExpirationStatus = (date: Date) => {
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
            <AddClientDialog />
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
              {status === "executing"
                ? // Loading skeleton rows
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-6 w-[120px]" />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Skeleton className="h-6 w-[100px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[80px]" />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Skeleton className="h-6 w-[80px]" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Skeleton className="h-8 w-8 sm:hidden" />
                          <Skeleton className="h-8 w-24 hidden sm:block" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                : clientsData?.data?.data?.clients?.map(
                    (client: GetClientsResponse) => {
                      const expiration = client.subscription?.renewal_date
                        ? getExpirationStatus(client.subscription.renewal_date)
                        : { variant: "destructive", text: "No subscription" };

                      return (
                        <TableRow key={client.id}>
                          <TableCell className="font-medium">
                            {client.name} {client.surname}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge
                              variant="outline"
                              className="whitespace-nowrap"
                            >
                              {client.subscription?.sub_type ||
                                "No subscription"}
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
                              variant={
                                client.subscription ? "success" : "destructive"
                              }
                              className="whitespace-nowrap"
                            >
                              {client.subscription ? (
                                <CheckIcon className="size-3.5 mr-1" />
                              ) : (
                                <XIcon className="size-3.5 mr-1" />
                              )}
                              {client.subscription ? "Active" : "Inactive"}
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
                    }
                  )}
            </TableBody>
          </Table>

          {clientsData?.data?.data?.pagination && (
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <div className="text-sm">
                Page {page} of {clientsData?.data?.data?.pagination?.pages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPage(
                    Math.min(
                      clientsData?.data?.data?.pagination?.pages,
                      page + 1
                    )
                  )
                }
                disabled={page === clientsData?.data?.data?.pagination?.pages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
