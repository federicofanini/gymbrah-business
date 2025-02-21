import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

const admins = ["fedef@gymbrah.com"];

interface TesterLayoutProps {
  children: React.ReactNode;
}

export default async function TesterLayout({ children }: TesterLayoutProps) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data?.user?.email || !admins.includes(data.user.email)) {
    redirect("/business");
  }

  return <>{children}</>;
}
