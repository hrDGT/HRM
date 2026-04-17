import { useTranslations } from "next-intl";

import { DashboardTableHead } from "@/components/dashboard/ui/dashboard-table-head";
import { type TableColumn } from "@/components/ui/data-table";

import { Position } from "./positions-page-content";

export function getPositionsColumns({
  tCommon,
  sortField,
  sortOrder,
  onSort,
}: {
  tCommon: ReturnType<typeof useTranslations>;
  sortField: keyof Position;
  onSort: (field: keyof Position) => void;
  sortOrder: "asc" | "desc";
}): TableColumn<Position>[] {
  const columns: TableColumn<Position>[] = [
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
      render: (pos) => pos.name,
    },
  ];

  return columns;
}
