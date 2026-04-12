import { Suspense } from "react";
import { Metadata } from "next";

import { fetchDepartments } from "@/components/departments/actions/get-departments-action";
import { DepartmentsClient } from "@/components/departments/ui/departments-client";
import { DepartmentsTableSkeleton } from "@/components/departments/ui/departments-table-skeleton";
import { requireUser } from "@/lib/auth/require-user";

export const metadata: Metadata = {
  title: "HRM | Departments",
  description: "Manage company departments and view organizational structure.",
};

async function DepartmentsData({ isAdmin }: { isAdmin: boolean }) {
  const departments = await fetchDepartments();
  return (
    <DepartmentsClient initialDepartments={departments} isAdmin={isAdmin} />
  );
}

export default async function DepartmentsPage() {
  const user = await requireUser();
  const isAdmin = user?.role === "Admin";

  return (
    <Suspense fallback={<DepartmentsTableSkeleton isAdmin={isAdmin} />}>
      <DepartmentsData isAdmin={isAdmin} />
    </Suspense>
  );
}
