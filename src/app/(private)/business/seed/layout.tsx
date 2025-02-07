import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

const ADMIN_EMAILS = ["fedef@gymbrah.com"] as const;

type AdminEmail = (typeof ADMIN_EMAILS)[number];

interface SeedLayoutProps {
  children: React.ReactNode;
}

export default async function SeedLayout({ children }: SeedLayoutProps) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (
    error ||
    !user?.email ||
    !((user.email as AdminEmail) === ADMIN_EMAILS[0])
  ) {
    redirect("/business");
  }

  return <>{children}</>;
}
