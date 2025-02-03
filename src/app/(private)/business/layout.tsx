import { redirect } from "next/navigation";
import { Metadata } from "next";
import { SidebarInset } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/server";
import { DashboardHeader } from "@/components/dashboard-header";
import { prisma } from "@/lib/db";
import { Sidebar } from "@/components/private/b2b/sidebar";
import { Header } from "@/components/private/b2b/header";
import { Toaster } from "@/components/ui/sonner";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Blackboard",
  description: "Blackboard",
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  const userData = await prisma.user.findUnique({
    where: {
      id: data.user.id,
    },
    select: {
      full_name: true,
    },
  });

  if (!userData?.full_name) {
    redirect("/onboarding");
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />

        <SidebarInset className="flex-1 bg-noise pb-8">
          <Header />

          <main className="pt-4">
            {children}

            {/* {!admins.includes(userData.email) && <ComingSoon />} */}
            <Toaster />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
