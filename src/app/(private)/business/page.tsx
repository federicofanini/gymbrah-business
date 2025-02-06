import { Suspense } from "react";
import { BusinessPage } from "@/components/private/b2b/business";
import {
  getClientStats,
  getClients,
} from "@/actions/business/client/get-clients";
import { getRevenueStats } from "@/actions/business/client/get-revenues";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

async function BusinessPageWrapper() {
  const [statsResult, clientsResult, revenueResult] = await Promise.all([
    getClientStats(),
    getClients({ page: 1, limit: 10 }),
    getRevenueStats(),
  ]);

  if (!statsResult?.data?.success || !statsResult.data) {
    throw new Error("Failed to load client stats");
  }

  if (!clientsResult?.data?.success || !clientsResult.data) {
    throw new Error("Failed to load clients");
  }

  if (!revenueResult?.data?.success || !revenueResult.data) {
    throw new Error("Failed to load revenue stats");
  }

  const clientStats = {
    totalClients: statsResult.data.data.totalClients,
    percentageChange: statsResult.data.data.percentageChange,
    monthlyRevenue: {
      value: revenueResult.data.data.currentMonthRevenue,
      percentageChange: revenueResult.data.data.percentageChange,
    },
    activeSessions: {
      value: 0, // TODO: Add to getClientStats
      percentageChange: 0,
    },
  };

  return (
    <BusinessPage
      clientStats={clientStats}
      clients={clientsResult.data.data.clients}
    />
  );
}

function LoadingSkeleton() {
  return (
    <div className="w-full px-4 md:px-8 py-4 space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function Business() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <BusinessPageWrapper />
    </Suspense>
  );
}
