import { Metadata } from "next";

import { fetchDepartments } from "@/components/departments/departments-action";
import { DepartmentsClient } from "@/components/departments/departments-client";

export const metadata: Metadata = {
  title: "HRM | Departments",
  description: "Manage company departments and view organizational structure.",
};

export default async function DepartmentsPage() {
  const departments = await fetchDepartments();

  return <DepartmentsClient initialDepartments={departments} />;
}
