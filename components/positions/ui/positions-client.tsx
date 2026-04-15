"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { DashboardHeader } from "@/components/dashboard/ui/dashboard-header";
import { DashBoardNoResults } from "@/components/dashboard/ui/dashboard-no-results";
import { BaseAlertModal } from "@/components/ui/base-alert-modal";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { GetPositionsQuery } from "@/gqlcodegen/graphql";

import { usePositionsLogic } from "../hooks/use-positions-logic";

import { CreatePositionModal } from "./create-position-modal";
import { getPositionsColumns } from "./positions-columns";
import { UpdatePositionModal } from "./update-position.modal";

export type Position = GetPositionsQuery["positions"][0];

type Props = {
  initialPositions: Position[];
  isAdmin: boolean;
};

export function PositionsClient({ initialPositions, isAdmin }: Props) {
  const state = usePositionsLogic(initialPositions, isAdmin);

  const [editingPos, setEditingPos] = useState<Position | null>(null);
  const [deletingPos, setDeletingPos] = useState<Position | null>(null);

  const t = useTranslations("Positions");
  const tCommon = useTranslations("Common");

  const columns = getPositionsColumns({
    t,
    tCommon,
    isAdmin: state.isAdmin,
    isPending: state.isPending,
    sortField: state.sortField,
    sortOrder: state.sortOrder,
    onSort: state.handleSort,
    onEdit: setEditingPos,
    onDelete: setDeletingPos,
  });
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
        data={state.filteredPositions}
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
