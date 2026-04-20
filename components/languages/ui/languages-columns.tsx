import { useTranslations } from "next-intl";

import { DashboardTableHead } from "@/components/dashboard/ui/dashboard-table-head";
import { type TableColumn } from "@/components/ui/data-table";

import { Language } from "./languages-page-content";

export function getLanguagesColumns({
  tCommon,
  sortField,
  sortOrder,
  onSort,
}: {
  tCommon: ReturnType<typeof useTranslations>;
  sortField: keyof Language;
  onSort: (field: keyof Language) => void;
  sortOrder: "asc" | "desc";
}): TableColumn<Language>[] {
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
      render: (lang) => lang.name,
    },
    {
      header: (
        <DashboardTableHead
          headTitle={tCommon("fields.nativeName")}
          field="native_name"
          currentSortField={sortField}
          sortOrder={sortOrder}
          onSort={() => onSort("native_name")}
        />
      ),
      render: (lang) => lang.native_name || "—",
    },
    {
      header: (
        <DashboardTableHead
          headTitle={tCommon("fields.iso2")}
          field="iso2"
          currentSortField={sortField}
          sortOrder={sortOrder}
          onSort={() => onSort("iso2")}
        />
      ),
      render: (lang) => lang.iso2,
    },
  ];
}
