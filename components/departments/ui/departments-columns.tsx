import { useTranslations } from "next-intl";
import { MoreVerticalIcon } from "lucide-react";

import { DashboardTableHead } from "@/components/dashboard/ui/dashboard-table-head";
import { Button } from "@/components/ui/button";
import { type TableColumn } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { type Department } from "./departments-client";

export function getDepartmentColumns({
  t,
  tCommon,
  isAdmin,
  isPending,
  sortField,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
}: {
  t: ReturnType<typeof useTranslations>;
  tCommon: ReturnType<typeof useTranslations>;
  isAdmin: boolean;
  isPending: boolean;
  sortField: keyof Department;
  onSort: (field: keyof Department) => void;
  sortOrder: "asc" | "desc";
  onEdit: (dept: Department) => void;
  onDelete: (dept: Department) => void;
}): TableColumn<Department>[] {
  const columns: TableColumn<Department>[] = [
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

  if (isAdmin) {
    columns.push({
      header: "",
      className: "text-right py-4",
      render: (dept: Department) => (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-full transition-opacity disabled:opacity-50 hover:bg-action-hover"
              disabled={isPending}
            >
              <MoreVerticalIcon className="size-5 stroke-action-color" />
              <span className="sr-only">{t("openMenu")}</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="bg-white w-full py-2"
            align="end"
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <DropdownMenuItem
              className="py-1.5 px-4 cursor-pointer hover:bg-main-bg transition-colors text-base"
              onSelect={() => onEdit(dept)}
            >
              {t("updateAction")}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="py-1.5 px-4 cursor-pointer hover:bg-main-bg transition-colors text-base"
              onSelect={() => onDelete(dept)}
            >
              {t("deleteAction")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    });
  }

  return columns;
}
