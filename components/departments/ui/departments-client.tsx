"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { DashboardHeader } from "@/components/dashboard/ui/dashboard-header";
import { DashBoardNoResults } from "@/components/dashboard/ui/dashboard-no-results";
import { BaseAlertModal } from "@/components/ui/base-alert-modal";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { GetDepartmentsQuery } from "@/gqlcodegen/graphql";

import { useDepartmentsLogic } from "../hooks/use-department-logic";

import { CreateDepartmentModal } from "./create-department-modal";
import { getDepartmentColumns } from "./departments-columns";
import { UpdateDepartmentModal } from "./update-department-modal";

export type Department = GetDepartmentsQuery["departments"][0];

type Props = {
  initialDepartments: Department[];
  isAdmin: boolean;
};

export function DepartmentsClient({ initialDepartments, isAdmin }: Props) {
  const state = useDepartmentsLogic(initialDepartments, isAdmin);

  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deletingDept, setDeletingDept] = useState<Department | null>(null);

  const t = useTranslations("Departments");
  const tCommon = useTranslations("Common");

  const columns = getDepartmentColumns({
    t,
    tCommon,
    isAdmin: state.isAdmin,
    isPending: state.isPending,
    sortField: state.sortField,
    sortOrder: state.sortOrder,
    onSort: state.handleSort,
    onEdit: setEditingDept,
    onDelete: setDeletingDept,
  });

  return (
    <section className="max-w-7xl w-full mx-auto">
      <DashboardHeader
        title={t("title")}
        searchValue={state.searchValue}
        onChange={state.handleSearchChange}
        isAdmin={state.isAdmin}
        createModal={<CreateDepartmentModal />}
      />

      <DataTable
        data={state.filteredDepartments}
        columns={columns}
        emptyState={
          <DashBoardNoResults
            isAdmin={state.isAdmin}
            columnsCount={state.isAdmin ? 2 : 1}
            onReset={state.resetSearch}
            action={
              <Button
                variant="ghost"
                onClick={state.resetSearch}
                className="uppercase text-secondary-text hover:underline text-sm font-medium tracking-wide"
              >
                {tCommon("actions.resetSearch")}
              </Button>
            }
          />
        }
      />

      {editingDept && (
        <UpdateDepartmentModal
          department={editingDept}
          open={true}
          onOpenChange={(isOpen) => !isOpen && setEditingDept(null)}
        />
      )}

      {deletingDept && (
        <BaseAlertModal
          open={true}
          onOpenChange={(isOpen) => !isOpen && setDeletingDept(null)}
          title={t("deleteModalTitle")}
          description={t("deleteConfirmation")}
          itemName={deletingDept.name}
          confirmText={tCommon("actions.confirm")}
          confirmingText={tCommon("actions.confirming")}
          isPending={state.isPending}
          onConfirm={() => {
            state.handleDelete(deletingDept.id);
            setDeletingDept(null);
          }}
        />
      )}
    </section>
  );
}
