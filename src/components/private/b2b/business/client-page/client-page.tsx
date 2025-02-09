"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryState } from "nuqs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Calendar, ArrowLeftIcon, Mail, Phone } from "lucide-react";
import { ClientSub } from "./client-sub";
import Link from "next/link";
import { format } from "date-fns";
import { MdCalendarMonth } from "react-icons/md";

interface ClientPageProps {
  client: {
    id: string;
    athlete: {
      id: string;
      name: string;
      surname: string;
      email: string;
      phone: string;
      birth_date: Date;
      gender: string;
    };
    subscription: {
      id: string;
      sub_type: string;
      payment_date: Date;
      renewal_date: Date;
      months_paid: number;
      created_at: Date;
      updated_at: Date;
    } | null;
  };
}

export function ClientPage({ client }: ClientPageProps) {
  const [tab, setTab] = useQueryState("tab", {
    defaultValue: "overview",
  });

  const tabs = [
    { id: "overview", title: "Overview" },
    { id: "subscription", title: "Subscription" },
  ];

  return (
    <div className="w-full px-4 md:px-8 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-bold">
            {client.athlete.name} {client.athlete.surname}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="capitalize">
              {client.athlete.gender}
            </Badge>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <MdCalendarMonth className="size-4" />
              {client.athlete.birth_date
                ? format(new Date(client.athlete.birth_date), "MMM d, yyyy")
                : "Not provided"}
            </span>
          </div>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link
            href="/business"
            className="flex items-center justify-center gap-2 text-sm"
          >
            <ArrowLeftIcon className="size-4" />
            Go Back
          </Link>
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="justify-start rounded-none h-auto p-0 bg-transparent space-x-4 md:space-x-6 overflow-x-auto">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="rounded-none border-b-2 border-transparent text-primary data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2 text-sm md:text-base whitespace-nowrap"
            >
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">
                  Email
                </CardTitle>
                <Mail className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm md:text-base font-medium truncate">
                  {client.athlete.email}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">
                  Phone
                </CardTitle>
                <Phone className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm md:text-base font-medium">
                  {client.athlete.phone}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">
                  Status
                </CardTitle>
                <Activity className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Badge variant={client.subscription ? "success" : "secondary"}>
                  {client.subscription ? "Active" : "Inactive"}
                </Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">
                  Member Since
                </CardTitle>
                <Calendar className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm md:text-base font-medium">
                  {client.subscription?.created_at
                    ? format(
                        new Date(client.subscription.created_at),
                        "MMM d, yyyy"
                      )
                    : "Not available"}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subscription" className="mt-6">
          <ClientSub client={client} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
