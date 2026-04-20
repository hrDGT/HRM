import { Suspense } from "react";
import { Metadata } from "next";

import { fetchDepartments } from "@/components/departments/queries/get-departments-query";
import { DepartmentsPageContent } from "@/components/departments/ui/departments-page-content";
import { DepartmentsTableSkeleton } from "@/components/departments/ui/departments-table-skeleton";
import { getAuthProps } from "@/lib/auth/get-auth-props";
import { requireUser } from "@/lib/auth/require-user";

export const metadata: Metadata = {
  title: "HRM | Departments",
  description: "Manage company departments and view organizational structure.",
};

async function DepartmentsData({
  isAdmin,
  token,
  cookieHeader,
}: {
  isAdmin: boolean;
  token?: string;
  cookieHeader?: string;
}) {
  const departments = await fetchDepartments(token, cookieHeader);

  return (
    <DepartmentsPageContent
      initialDepartments={departments}
      isAdmin={isAdmin}
    />
  );
}

export default async function DepartmentsPage() {
  const [user, { token, cookieHeader }] = await Promise.all([
    requireUser(),
    getAuthProps(),
  ]);
  const isAdmin = user?.role === "Admin";

  return (
    <Suspense fallback={<DepartmentsTableSkeleton isAdmin={isAdmin} />}>
      <DepartmentsData isAdmin={isAdmin} token={token} cookieHeader={cookieHeader} />
    </Suspense>
  );
}
