import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import SettingPageContent from "@/components/settings/ui/settings-page-content";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Settings");
  return { title: `HRM | ${t("title")}` };
}

export default function SettingsPage() {
  return <SettingPageContent />;
}
