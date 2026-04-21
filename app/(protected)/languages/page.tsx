import { Suspense } from "react";
import { Metadata } from "next";

import { fetchLanguages } from "@/components/languages/queries/get-languages-query";
import { LanguagesPageContent } from "@/components/languages/ui/languages-page-content";
import { LanguagesTableSkeleton } from "@/components/languages/ui/languages-table-skeleton";
import { getAuthProps } from "@/lib/auth/get-auth-props";
import { requireUser } from "@/lib/auth/require-user";

export const metadata: Metadata = {
  title: "HRM | Languages",
  description: "Manage company languages and view organizational structure.",
};

async function LanguagesData({
  isAdmin,
  token,
  cookieHeader,
}: {
  isAdmin: boolean;
  token?: string;
  cookieHeader?: string;
}) {
  const languages = await fetchLanguages(token, cookieHeader);

  return (
    <LanguagesPageContent initialLanguages={languages} isAdmin={isAdmin} />
  );
}

export default async function LanguagesPage() {
  const [user, { token, cookieHeader }] = await Promise.all([
    requireUser(),
    getAuthProps(),
  ]);
  const isAdmin = user?.role === "Admin";

  return (
    <Suspense fallback={<LanguagesTableSkeleton isAdmin={isAdmin} />}>
      <LanguagesData isAdmin={isAdmin} token={token} cookieHeader={cookieHeader} />
    </Suspense>
  );
}
