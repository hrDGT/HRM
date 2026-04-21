import { Suspense } from "react";
import { Metadata } from "next";

import { fetchSkillsCategories } from "@/components/skills/queries/get-skills-categories-query";
import { fetchSkills } from "@/components/skills/queries/get-skills-query";
import { SkillsPageContent } from "@/components/skills/ui/skills-page-content";
import { SkillsTableSkeleton } from "@/components/skills/ui/skills-table-skeleton";
import { getAuthProps } from "@/lib/auth/get-auth-props";
import { requireUser } from "@/lib/auth/require-user";

export const metadata: Metadata = {
  title: "HRM | Skills",
  description: "Manage company skills and category.",
};

async function SkillsData({
  isAdmin,
  token,
  cookieHeader,
  user,
}: {
  isAdmin: boolean;
  token?: string;
  cookieHeader?: string;
  user: Awaited<ReturnType<typeof requireUser>>;
}) {
  const [skills, skillsCategories] = await Promise.all([
    fetchSkills(token, cookieHeader),
    fetchSkillsCategories(token, cookieHeader),
  ]);

  return (
    <SkillsPageContent
      initialSkills={skills}
      skillsCategories={skillsCategories}
      isAdmin={isAdmin}
      user={user}
    />
  );
}

export default async function SkillsPage() {
  const [user, { token, cookieHeader }] = await Promise.all([
    requireUser(),
    getAuthProps(),
  ]);
  const isAdmin = user?.role === "Admin";

  return (
    <Suspense fallback={<SkillsTableSkeleton isAdmin={isAdmin} />}>
      <SkillsData isAdmin={isAdmin} token={token} cookieHeader={cookieHeader} user={user} />
    </Suspense>
  );
}
