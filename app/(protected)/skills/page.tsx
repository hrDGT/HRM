import { Suspense } from "react";
import { Metadata } from "next";
import { cookies } from "next/headers";

import { fetchSkillsCategories } from "@/components/skills/queries/get-skills-categories-query";
import { fetchSkills } from "@/components/skills/queries/get-skills-query";
import { SkillsPageContent } from "@/components/skills/ui/skills-page-content";
import { SkillsTableSkeleton } from "@/components/skills/ui/skills-table-skeleton";
import { requireUser } from "@/lib/auth/require-user";

export const metadata: Metadata = {
  title: "HRM | Skills",
  description: "Manage company skills and category.",
};

async function SkillsData({
  isAdmin,
  token,
}: {
  isAdmin: boolean;
  token?: string;
}) {
  const [skills, skillsCategories] = await Promise.all([
    fetchSkills(token),
    fetchSkillsCategories(token),
  ]);

  return (
    <SkillsPageContent
      initialSkills={skills}
      skillsCategories={skillsCategories}
      isAdmin={isAdmin}
    />
  );
}

export default async function SkillsPage() {
  const [user, cookieStore] = await Promise.all([requireUser(), cookies()]);
  const isAdmin = user?.role === "Admin";

  const token = cookieStore.get("access_token")?.value;

  return (
    <Suspense fallback={<SkillsTableSkeleton isAdmin={isAdmin} />}>
      <SkillsData isAdmin={isAdmin} token={token} />
    </Suspense>
  );
}
