import { getTesters } from "@/components/private/settings/admin/tester";
import { SettingsAdminPage } from "@/components/private/settings/admin";

export default async function TesterPage() {
  const result = await getTesters();

  if (!result.success || !result.data) {
    throw new Error(result.error || "Failed to fetch testers");
  }

  return <SettingsAdminPage testers={result.data} />;
}
