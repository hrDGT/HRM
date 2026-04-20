import { DashboardTableHead } from "@/components/dashboard/ui/dashboard-table-head";

import { type Skill } from "./skills-page-content";

export type SkillWithExtras = Skill & { categoryName: string };

interface GetSkillsColumnsProps {
  tCommon: (key: string) => string;
  sortField: keyof SkillWithExtras;
  sortOrder: "asc" | "desc";
  onSort: (field: keyof SkillWithExtras) => void;
}

export const getSkillsColumns = ({
  tCommon,
  sortField,
  sortOrder,
  onSort,
}: GetSkillsColumnsProps) => [
  {
    header: (
      <DashboardTableHead
        headTitle={tCommon("fields.name")}
        field="name"
        currentSortField={sortField}
        sortOrder={sortOrder}
        onSort={() => onSort("name")}
      />
    ),
    render: (skill: SkillWithExtras) => skill.name,
  },
  {
    header: (
      <DashboardTableHead
        headTitle={tCommon("fields.category")}
        field="categoryName"
        currentSortField={sortField}
        sortOrder={sortOrder}
        onSort={() => onSort("categoryName")}
      />
    ),
    render: (skill: SkillWithExtras) => skill.category?.name || "—",
  },
];
