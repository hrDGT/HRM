"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MoreVerticalIcon } from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/ui/dashboard-header";
import { DashBoardNoResults } from "@/components/dashboard/ui/dashboard-no-results";
import { DashboardTableHead } from "@/components/dashboard/ui/dashboard-table-head";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GetDepartmentsQuery } from "@/gqlcodegen/graphql";

import { useDepartmentsLogic } from "../hooks/use-department-logic";

import { UpdateDepartmentModal } from "./update-department-modal";

type Department = GetDepartmentsQuery["departments"][0];

export function DepartmentsClient({
  initialDepartments,
  isAdmin,
}: {
  initialDepartments: Department[];
  isAdmin: boolean;
}) {
  const state = useDepartmentsLogic(initialDepartments, isAdmin);

  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const t = useTranslations("Departments");
  const tCommon = useTranslations("Common");

  return (
    <section className="max-w-7xl w-full mx-auto">
      <DashboardHeader
        title={t("title")}
        searchValue={state.searchValue}
        onChange={state.handleSearchChange}
        isAdmin={state.isAdmin}
      />

      <Table>
        <TableHeader>
          <TableRow className="border-main-border">
            <DashboardTableHead
              headTitle={tCommon("fields.name")}
              field="name"
              currentSortField={state.sortField}
              sortOrder={state.sortOrder}
              onSort={() => state.handleSort("name")}
            />
          </TableRow>
        </TableHeader>

        <TableBody>
          {state.filteredDepartments.length > 0 ? (
            state.filteredDepartments.map((dept) => (
              <TableRow
                key={dept.id}
                className="border-main-border font-normal min-h-16.25"
              >
                <TableCell className="p-4">{dept.name}</TableCell>

                {state.isAdmin && (
                  <TableCell className="text-right py-4">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 rounded-full hover:bg-action-hover"
                          disabled={state.isPending}
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
                          onSelect={() => setEditingDept(dept)}
                        >
                          {t("updateAction")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="py-1.5 px-4 cursor-pointer hover:bg-main-bg transition-colors text-base"
                          onSelect={() => {
                            setTimeout(() => {
                              state.handleDelete(dept.id);
                            }, 0);
                          }}
                        >
                          {t("deleteAction")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <DashBoardNoResults
              isAdmin={state.isAdmin}
              columnsCount={state.isAdmin ? 2 : 1}
              onReset={state.resetSearch}
            />
          )}
        </TableBody>
      </Table>

      {editingDept && (
        <UpdateDepartmentModal
          department={editingDept}
          open={true}
          onOpenChange={(isOpen) => !isOpen && setEditingDept(null)}
        />
      )}
    </section>
  );
}
