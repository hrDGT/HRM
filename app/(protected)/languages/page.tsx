import { Suspense } from "react";
import { Metadata } from "next";
import { cookies } from "next/headers";

import { fetchLanguages } from "@/components/languages/queries/get-languages-query";
import { LanguagesPageContent } from "@/components/languages/ui/languages-page-content";
import { LanguagesTableSkeleton } from "@/components/languages/ui/languages-table-skeleton";
import { requireUser } from "@/lib/auth/require-user";

export const metadata: Metadata = {
  title: "HRM | Languages",
  description: "Manage company languages and view organizational structure.",
};

async function LanguagesData({
  isAdmin,
  token,
}: {
  isAdmin: boolean;
  token?: string;
}) {
  const languages = await fetchLanguages(token);

  return (
    <LanguagesPageContent initialLanguages={languages} isAdmin={isAdmin} />
  );
}

export default async function LanguagesPage() {
  const [user, cookieStore] = await Promise.all([requireUser(), cookies()]);
  const isAdmin = user?.role === "Admin";

  const token = cookieStore.get("access_token")?.value;

  return (
    <Suspense fallback={<LanguagesTableSkeleton isAdmin={isAdmin} />}>
      <LanguagesData isAdmin={isAdmin} token={token} />
    </Suspense>
  );
}
