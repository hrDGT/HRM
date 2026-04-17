import { useTranslations } from "next-intl";

import { DashboardTableHead } from "@/components/dashboard/ui/dashboard-table-head";
import { type TableColumn } from "@/components/ui/data-table";

import { type Department } from "./departments-page-content";

export function getDepartmentColumns({
  tCommon,
  sortField,
  sortOrder,
  onSort,
}: {
  tCommon: ReturnType<typeof useTranslations>;
  sortField: keyof Department;
  onSort: (field: keyof Department) => void;
  sortOrder: "asc" | "desc";
}): TableColumn<Department>[] {
  return [
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
      render: (dept) => dept.name,
    },
  ];
}
