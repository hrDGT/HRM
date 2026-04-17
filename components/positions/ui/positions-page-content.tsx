"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { useTableLogic } from "@/components/dashboard/hooks/use-table-logic";
import { DashboardHeader } from "@/components/dashboard/ui/dashboard-header";
import { DashBoardNoResults } from "@/components/dashboard/ui/dashboard-no-results";
import { BaseAlertModal } from "@/components/ui/base-alert-modal";
import { Button } from "@/components/ui/button";
import { DataTable, type TableAction } from "@/components/ui/data-table";
import { GetPositionsQuery } from "@/gqlcodegen/graphql";

import { deletePositionAction } from "../actions/delete-positions-action";

import { CreatePositionModal } from "./create-position-modal";
import { getPositionsColumns } from "./positions-columns";
import { UpdatePositionModal } from "./update-position.modal";

export type Position = GetPositionsQuery["positions"][0];

type Props = {
  initialPositions: Position[];
  isAdmin: boolean;
};

export function PositionsPageContent({ initialPositions, isAdmin }: Props) {
  const t = useTranslations("Positions");
  const tCommon = useTranslations("Common");

  const state = useTableLogic({
    initialData: initialPositions,
    isAdmin,
    searchFields: ["name"],
    initialSortField: "name",
    deleteAction: deletePositionAction,
    deleteSuccessMessage: t("toasts.deleted"),
  });

  const [editingPos, setEditingPos] = useState<Position | null>(null);
  const [deletingPos, setDeletingPos] = useState<Position | null>(null);

  const columns = getPositionsColumns({
    tCommon,
    sortField: state.sortField,
    sortOrder: state.sortOrder,
    onSort: state.handleSort,
  });

  const tableActions: TableAction<Position>[] = state.isAdmin
    ? [
        {
          title: t("updateAction"),
          action: setEditingPos,
        },
        {
          title: t("deleteAction"),
          action: setDeletingPos,
        },
      ]
    : [];

  return (
    <section className="max-w-7xl w-full mx-auto">
      <DashboardHeader
        title={t("title")}
        searchValue={state.searchValue}
        onChange={state.handleSearchChange}
        isAdmin={state.isAdmin}
        createModal={<CreatePositionModal />}
      />

      <DataTable
        data={state.filteredData}
        columns={columns}
        actions={tableActions}
        actionMenuLabel={t("openMenu")}
        isPending={state.isPending}
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

      {editingPos && (
        <UpdatePositionModal
          position={editingPos}
          open={true}
          onOpenChange={(isOpen) => !isOpen && setEditingPos(null)}
        />
      )}

      {deletingPos && (
        <BaseAlertModal
          open={true}
          onOpenChange={(isOpen) => !isOpen && setDeletingPos(null)}
          title={t("deleteModalTitle")}
          description={t("deleteConfirmation")}
          itemName={deletingPos.name}
          confirmText={tCommon("actions.confirm")}
          confirmingText={tCommon("actions.confirming")}
          isPending={state.isPending}
          onConfirm={() => {
            state.handleDelete(deletingPos.id);
            setDeletingPos(null);
          }}
        />
      )}
    </section>
  );
}
