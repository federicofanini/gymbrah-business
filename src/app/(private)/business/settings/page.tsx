import { Suspense } from "react";
import { SettingsPage } from "@/components/private/settings";
import { getBusinessDetails } from "@/actions/business/details/get";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function SettingsSkeleton() {
  return (
    <div className="w-full px-4 md:px-8 py-4">
      <div className="space-x-4 md:space-x-6 mb-6">
        <Skeleton className="h-8 w-32 rounded-md" />
        <Skeleton className="h-8 w-32 rounded-md" />
      </div>

      <Card className="w-full bg-noise">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
    </div>
  );
}

export default async function Settings() {
  const response = await getBusinessDetails();

  if (!response?.data?.success) {
    throw new Error(response?.data?.error);
  }

  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsPage businessDetails={response.data.data} />
    </Suspense>
  );
}
