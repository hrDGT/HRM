"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { useTableLogic } from "@/components/dashboard/hooks/use-table-logic";
import { DashboardHeader } from "@/components/dashboard/ui/dashboard-header";
import { DashBoardNoResults } from "@/components/dashboard/ui/dashboard-no-results";
import { BaseAlertModal } from "@/components/ui/base-alert-modal";
import { Button } from "@/components/ui/button";
import { DataTable, type TableAction } from "@/components/ui/data-table";
import { GetSkillCategoriesQuery, GetSkillsQuery } from "@/gqlcodegen/graphql";

import { deleteSkillAction } from "../actions/delete-skills-action";

import { CreateSkillModal } from "./create-skill-modal";
import { getSkillsColumns } from "./skills-columns";
import { UpdateSkillModal } from "./update-skill-modal";

export type Skill = GetSkillsQuery["skills"][0];

export type Category = GetSkillCategoriesQuery["skillCategories"][0];

type Props = {
  initialSkills: Skill[];
  skillsCategories: Category[];
  isAdmin: boolean;
};

export function SkillsPageContent({
  initialSkills,
  skillsCategories,
  isAdmin,
}: Props) {
  const t = useTranslations("Skills");
  const tCommon = useTranslations("Common");

  const processedSkills = initialSkills.map((skill) => ({
    ...skill,
    categoryName: skill.category?.name || "",
  }));

  const categoryOptions = skillsCategories.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }));

  const state = useTableLogic({
    initialData: processedSkills,
    isAdmin,
    searchFields: ["name"],
    initialSortField: "name",
    deleteAction: deleteSkillAction,
    deleteSuccessMessage: t("toasts.deleted"),
  });

  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [deletingSkill, setDeletingSkill] = useState<Skill | null>(null);

  const columns = getSkillsColumns({
    tCommon,
    sortField: state.sortField,
    sortOrder: state.sortOrder,
    onSort: state.handleSort,
  });

  const tableActions: TableAction<Skill>[] = state.isAdmin
    ? [
        {
          title: t("updateAction"),
          action: setEditingSkill,
        },
        {
          title: t("deleteAction"),
          action: setDeletingSkill,
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
        createModal={<CreateSkillModal categoryOptions={categoryOptions} />}
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

      {editingSkill && (
        <UpdateSkillModal
          skill={editingSkill}
          categoryOptions={categoryOptions}
          open={true}
          onOpenChange={(isOpen) => !isOpen && setEditingSkill(null)}
        />
      )}

      {deletingSkill && (
        <BaseAlertModal
          open={true}
          onOpenChange={(isOpen) => !isOpen && setDeletingSkill(null)}
          title={t("deleteModalTitle")}
          description={t("deleteConfirmation")}
          itemName={deletingSkill.name}
          confirmText={tCommon("actions.confirm")}
          confirmingText={tCommon("actions.confirming")}
          isPending={state.isPending}
          onConfirm={() => {
            state.handleDelete(deletingSkill.id);
            setDeletingSkill(null);
          }}
        />
      )}
    </section>
  );
}
