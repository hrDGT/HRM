import { Suspense } from "react";
import { Metadata } from "next";
import { cookies } from "next/headers";

import { fetchDepartments } from "@/components/departments/queries/get-departments-query";
import { DepartmentsPageContent } from "@/components/departments/ui/departments-page-content";
import { DepartmentsTableSkeleton } from "@/components/departments/ui/departments-table-skeleton";
import { requireUser } from "@/lib/auth/require-user";

export const metadata: Metadata = {
  title: "HRM | Departments",
  description: "Manage company departments and view organizational structure.",
};

async function DepartmentsData({
  isAdmin,
  token,
}: {
  isAdmin: boolean;
  token?: string;
}) {
  const departments = await fetchDepartments(token);

  return (
    <DepartmentsPageContent
      initialDepartments={departments}
      isAdmin={isAdmin}
    />
  );
}

export default async function DepartmentsPage() {
  const [user, cookieStore] = await Promise.all([requireUser(), cookies()]);
  const isAdmin = user?.role === "Admin";

  const token = cookieStore.get("access_token")?.value;

  return (
    <Suspense fallback={<DepartmentsTableSkeleton isAdmin={isAdmin} />}>
      <DepartmentsData isAdmin={isAdmin} token={token} />
    </Suspense>
  );
}
