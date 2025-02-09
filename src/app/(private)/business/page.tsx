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
  const clientStats = {
    totalClients: 0,
    percentageChange: 0,
    monthlyRevenue: {
      value: 0,
      percentageChange: 0,
    },
    activeSessions: {
      value: 0, // TODO: Add to getClientStats
      percentageChange: 0,
    },
  };

  return <BusinessPage clientStats={clientStats} clients={[]} />;
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
