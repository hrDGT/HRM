"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { useTableLogic } from "@/components/dashboard/hooks/use-table-logic";
import { DashboardHeader } from "@/components/dashboard/ui/dashboard-header";
import { DashBoardNoResults } from "@/components/dashboard/ui/dashboard-no-results";
import { BaseAlertModal } from "@/components/ui/base-alert-modal";
import { Button } from "@/components/ui/button";
import { DataTable, type TableAction } from "@/components/ui/data-table";
import { GetLanguagesQuery } from "@/gqlcodegen/graphql";

import { deleteLanguageAction } from "../actions/delete-languages-action";

import { CreateLanguageModal } from "./create-language-modal";
import { getLanguagesColumns } from "./languages-columns";
import { UpdateLanguageModal } from "./update-language-modal";

export type Language = NonNullable<GetLanguagesQuery["languages"][0]>;

type Props = {
  initialLanguages: (Language | null)[];
  isAdmin: boolean;
};

export function LanguagesPageContent({ initialLanguages, isAdmin }: Props) {
  const t = useTranslations("Languages");
  const tCommon = useTranslations("Common");

  const validLanguages = initialLanguages.filter(
    (lang): lang is Language => lang !== null,
  );

  const state = useTableLogic({
    initialData: validLanguages,
    isAdmin,
    searchFields: ["name"],
    initialSortField: "name",
    deleteAction: deleteLanguageAction,
    deleteSuccessMessage: t("toasts.deleted"),
  });

  const [editingLang, setEditingLang] = useState<Language | null>(null);
  const [deletingLang, setDeletingLang] = useState<Language | null>(null);

  const columns = getLanguagesColumns({
    tCommon,
    sortField: state.sortField,
    sortOrder: state.sortOrder,
    onSort: state.handleSort,
  });

  const tableActions: TableAction<Language>[] = state.isAdmin
    ? [
        {
          title: t("updateAction"),
          action: setEditingLang,
        },
        {
          title: t("deleteAction"),
          action: setDeletingLang,
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
        createModal={<CreateLanguageModal />}
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
            columnsCount={state.isAdmin ? 4 : 3}
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

      {editingLang && (
        <UpdateLanguageModal
          language={editingLang}
          open={true}
          onOpenChange={(isOpen) => !isOpen && setEditingLang(null)}
        />
      )}

      {deletingLang && (
        <BaseAlertModal
          open={true}
          onOpenChange={(isOpen) => !isOpen && setDeletingLang(null)}
          title={t("deleteModalTitle")}
          description={t("deleteConfirmation")}
          itemName={deletingLang.name}
          confirmText={tCommon("actions.confirm")}
          confirmingText={tCommon("actions.confirming")}
          isPending={state.isPending}
          onConfirm={() => {
            state.handleDelete(deletingLang.id);
            setDeletingLang(null);
          }}
        />
      )}
    </section>
  );
}
