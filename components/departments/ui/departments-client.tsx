"use client";

import { useState } from "react";

import { DashboardHeader } from "@/components/dashboard/ui/dashboard-header";
import { DashboardTableContent } from "@/components/dashboard/ui/dashboard-table-content";
import { DashboardTableHead } from "@/components/dashboard/ui/dashboard-table-head";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GetDepartmentsQuery } from "@/gqlcodegen/graphql";

import { useDepartmentsLogic } from "../hooks/use-department-logic";

import { UpdateDepartmentModal } from "./update-department-modal";

type Props = {
  initialDepartments: GetDepartmentsQuery["departments"];
  isAdmin: boolean;
};

export function DepartmentsClient({ initialDepartments, isAdmin }: Props) {
  const state = useDepartmentsLogic(initialDepartments, isAdmin);

  const [editingDept, setEditingDept] = useState<{
    id: string;
    name: string;
  } | null>(null);

  return (
    <section className="max-w-7xl w-full mx-auto">
      <DashboardHeader
        title="Departments"
        searchValue={state.searchValue}
        onChange={state.handleSearchChange}
        isAdmin={state.isAdmin}
      />
      <Table>
        <TableHeader>
          <TableRow className="border-main-border">
            <DashboardTableHead
              headTitle="Name"
              field="name"
              currentSortField={state.sortField}
              sortOrder={state.sortOrder}
              onSort={state.handleSort}
            />
          </TableRow>
        </TableHeader>
        <TableBody>
          <DashboardTableContent
            data={state.filteredDepartments}
            isAdmin={state.isAdmin}
            actionTitle="department"
            columnsCount={1}
            onReset={state.resetSearch}
            onDelete={state.handleDelete}
            onEdit={setEditingDept}
          >
            {(dept) => <TableCell className="p-4">{dept.name}</TableCell>}
          </DashboardTableContent>
        </TableBody>
      </Table>

      {editingDept && (
        <UpdateDepartmentModal
          department={editingDept}
          open={true}
          onOpenChange={(isOpen) => {
            if (!isOpen) setEditingDept(null);
          }}
        />
      )}
    </section>
  );
}
