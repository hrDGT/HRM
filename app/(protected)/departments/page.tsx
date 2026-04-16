import { Suspense } from "react";
import { Metadata } from "next";
import { cookies } from "next/headers";

import { fetchDepartments } from "@/components/departments/queries/get-departments-query";
import { DepartmentsClient } from "@/components/departments/ui/departments-client";
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
    <DepartmentsClient initialDepartments={departments} isAdmin={isAdmin} />
  );
}

export default async function DepartmentsPage() {
  const user = await requireUser();
  const isAdmin = user?.role === "Admin";

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  return (
    <Suspense fallback={<DepartmentsTableSkeleton isAdmin={isAdmin} />}>
      <DepartmentsData isAdmin={isAdmin} token={token} />
    </Suspense>
  );
}
