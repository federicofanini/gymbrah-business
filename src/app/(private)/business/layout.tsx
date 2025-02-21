import { redirect } from "next/navigation";
import { Metadata } from "next";
import { SidebarInset } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/server";
import { Sidebar } from "@/components/private/sidebar";
import { Header } from "@/components/private/header";
import { Toaster } from "@/components/ui/sonner";
import { checkBusiness } from "@/actions/business/onboarding/check-business";
import { Tester } from "@/components/private/tester/tester";
import { TesterEnd } from "@/components/private/tester/tester-end";
import {
  getTesters,
  getTesterCounts,
} from "@/components/private/settings/admin/tester";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Gym Manager",
  description: "Gym Manager Account",
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/");
  }

  const businessResponse = await checkBusiness({ user_id: data.user.id });

  if (
    businessResponse?.data?.success &&
    !businessResponse?.data?.data?.exists
  ) {
    redirect("/onboarding");
  }

  // Remove plan checking

  // const planResponse = await checkPlan({ user_id: data.user.id });

  // if (
  //   planResponse?.data?.success &&
  //   !planResponse?.data?.data?.hasActiveSubscription
  // ) {
  //   redirect("/onboarding");
  // }

  // console.log("paid plan", planResponse?.data?.data?.hasActiveSubscription);

  const testersResponse = await getTesters();
  const testers =
    testersResponse.success && testersResponse.data
      ? testersResponse.data.filter((tester: any) => tester.role === "business")
      : [];
  const testerEmails = testers.map((tester: any) => tester.email);

  // Check available tester spots
  const countsResponse = await getTesterCounts();
  const hasAvailableSpots =
    countsResponse.success && countsResponse.data?.business?.spotsLeft > 0;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />

        <SidebarInset className="flex-1 bg-noise pb-8">
          <Header />

          <main className="pt-4">
            {children}

            {data?.user?.email &&
              !testerEmails.includes(data.user.email) &&
              (hasAvailableSpots ? <Tester /> : <TesterEnd />)}
            <Toaster />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
