"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFilteredData } from "@/hooks/dashboard/use-filtered-data";
import { useTableControls } from "@/hooks/dashboard/use-table-controls";
import { GetDepartmentsQuery } from "@/gqlcodegen/graphql";
import { useUserStore } from "@/store/use-user-store";

import { DashboardHeader } from "../dashboard/dashboard-header";
import { DashboardTableContent } from "../dashboard/dashboard-table-content";
import { DashboardTableHead } from "../dashboard/dashboard-table-head";

type Props = {
  initialDepartments: GetDepartmentsQuery["departments"];
};

type DepartmentItem = GetDepartmentsQuery["departments"][0];

export function DepartmentsClient({ initialDepartments }: Props) {
  const isAdmin = useUserStore((state) => state.isAdmin);

  const {
    sortField,
    sortOrder,
    searchValue,
    handleSort,
    handleSearchChange,
    resetSearch,
  } = useTableControls<DepartmentItem>("name");

  const filteredAndSortedDepartments = useFilteredData({
    data: initialDepartments,
    searchValue,
    searchField: "name",
    sortField,
    sortOrder,
  });

  return (
    <section className="max-w-7xl w-full mx-auto">
      <DashboardHeader
        title="Departments"
        searchValue={searchValue}
        onChange={handleSearchChange}
        isAdmin={isAdmin}
        actionTitle="Create department"
      />
      <Table>
        <TableHeader>
          <TableRow className="border-main-border">
            <DashboardTableHead
              headTitle="Name"
              field="name"
              currentSortField={sortField as string}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          </TableRow>
        </TableHeader>
        <TableBody>
          <DashboardTableContent
            data={filteredAndSortedDepartments}
            isAdmin={isAdmin}
            actionTitle="department"
            columnsCount={1}
            onReset={resetSearch}
          >
            {(dept) => <TableCell className="p-4">{dept.name}</TableCell>}
          </DashboardTableContent>
        </TableBody>
      </Table>
    </section>
  );
}
