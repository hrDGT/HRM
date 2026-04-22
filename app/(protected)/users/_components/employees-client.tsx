"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ArrowDown,
  ChevronRight,
  MoreVertical,
  Plus,
  Search,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { EmployeeCard } from "@/lib/users/users-types";

import { CreateUserModal } from "./create-user-modal";
import { UpdateUserModal } from "./update-user-modal";

type Props = {
  employees: EmployeeCard[];
  currentUserId: string | number;
  currentUserRole: string;
  departments: { id: string; name: string }[];
  positions: { id: string; name: string }[];
};

export function EmployeesClient({
  employees: initialEmployees,
  currentUserId,
  currentUserRole,
  departments,
  positions,
}: Props) {
  const t = useTranslations("Users");
  const c = useTranslations("Common");

  const [employees, setEmployees] = useState(initialEmployees);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    field: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeCard | null>(
    null,
  );
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const router = useRouter();

  const handleUpdate = (updated: EmployeeCard) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === updated.id ? updated : e)),
    );
  };

  const handleCreate = (newEmployee: EmployeeCard) => {
    setEmployees((prev) => [newEmployee, ...prev]);
    setIsCreateOpen(false);
  };

  const handleSort = (field: string) => {
    setSortConfig((prev) => {
      if (!prev || prev.field !== field) return { field, direction: "asc" };
      if (prev.direction === "asc") return { field, direction: "desc" };
      return null;
    });
  };

  const displayed = [...employees]
    .filter((e) => {
      const q = search.toLowerCase();
      return (
        e.firstName.toLowerCase().includes(q) ||
        e.lastName.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.position.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (!sortConfig) return 0;
      const { field, direction } = sortConfig;
      const aVal = (a as any)[field]?.toLowerCase() ?? "";
      const bVal = (b as any)[field]?.toLowerCase() ?? "";
      return direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });

  const showActions = (empId: string | number) =>
    empId === currentUserId || currentUserRole === "Admin";

  return (
    <>
      <div className="pt-4">
        <h1 className="text-base text-secondary-text opacity-70 ml-4 mb-4">
          {t("title")}
        </h1>
        <div className="relative flex justify-between items-center gap-x-4 mx-4 mb-4 min-h-12">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-input-icon"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={c("placeholders.search")}
            className="pl-10 h-10 w-max min-w-80 rounded-4xl text-base text-main-text placeholder:text-secondary-text placeholder:opacity-70 hover:border-main-text focus-visible:ring-1 focus-visible:ring-main-border focus-visible:border-main-border"
          />
          {currentUserRole === "Admin" && (
            <Button
              data-testid="create-user-button"
              onClick={() => setIsCreateOpen(true)}
              className="gap-x-2 aspect-square text-primary text-sm uppercase rounded-xl hover:bg-hover-action-create-btn p-0 md:px-2"
            >
              <Plus className="mr-1.5 size-5" />
              {t("createUserButton")}
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow className="border-main-border hover:bg-transparent">
              <TableHead className="w-20" />
              <TableHead className="p-4 text-main-text text-sm select-none transition-colors font-medium">
                <div
                  className="inline-flex items-center gap-x-1 cursor-pointer hover:text-secondary-text transition-colors"
                  onClick={() => handleSort("firstName")}
                >
                  {c("fields.firstName")}
                  {sortConfig?.field === "firstName" &&
                    (sortConfig.direction === "asc" ? (
                      <ArrowDown
                        size={12}
                        className="size-4 transition-transform duration-200 stroke-secondary-text"
                      />
                    ) : (
                      <ArrowDown
                        size={12}
                        className="size-4 transition-transform duration-200 stroke-secondary-text rotate-180"
                      />
                    ))}
                </div>
              </TableHead>

              <TableHead className="p-4 text-main-text text-sm select-none transition-colors font-medium">
                <div
                  className="inline-flex items-center gap-x-1 cursor-pointer hover:text-secondary-text transition-colors"
<<<<<<< HEAD
                  onClick={() => handleSort("lastName")}
=======
                  onClick={() => handleSort("firstName")}
>>>>>>> 8e4f01ae90594f3199052e68e2a1a54ba3b3232f
                >
                  {c("fields.lastName")}
                  {sortConfig?.field === "lastName" &&
                    (sortConfig.direction === "asc" ? (
                      <ArrowDown
                        size={12}
                        className="size-4 transition-transform duration-200 stroke-secondary-text"
                      />
                    ) : (
                      <ArrowDown
                        size={12}
                        className="size-4 transition-transform duration-200 stroke-secondary-text rotate-180"
                      />
                    ))}
                </div>
              </TableHead>

              <TableHead className="p-4 text-main-text text-sm select-none hover:text-main-text transition-colors font-medium">
                <div
                  className="inline-flex items-center gap-x-1 cursor-pointer hover:text-secondary-text transition-colors"
<<<<<<< HEAD
                  onClick={() => handleSort("email")}
=======
                  onClick={() => handleSort("firstName")}
>>>>>>> 8e4f01ae90594f3199052e68e2a1a54ba3b3232f
                >
                  {c("fields.email")}
                  {sortConfig?.field === "email" &&
                    (sortConfig.direction === "asc" ? (
                      <ArrowDown
                        size={12}
                        className="size-4 transition-transform duration-200 stroke-secondary-text"
                      />
                    ) : (
                      <ArrowDown
                        size={12}
                        className="size-4 transition-transform duration-200 stroke-secondary-text rotate-180"
                      />
                    ))}
                </div>
              </TableHead>

              <TableHead className="p-4 text-main-text text-sm select-none hover:text-main-text transition-colors font-medium">
                <div
                  className="inline-flex items-center gap-x-1 cursor-pointer hover:text-secondary-text transition-colors"
<<<<<<< HEAD
                  onClick={() => handleSort("department")}
=======
                  onClick={() => handleSort("firstName")}
>>>>>>> 8e4f01ae90594f3199052e68e2a1a54ba3b3232f
                >
                  {c("fields.department")}
                  {sortConfig?.field === "department" &&
                    (sortConfig.direction === "asc" ? (
                      <ArrowDown
                        size={12}
                        className="size-4 transition-transform duration-200 stroke-secondary-text"
                      />
                    ) : (
                      <ArrowDown
                        size={12}
                        className="size-4 transition-transform duration-200 stroke-secondary-text rotate-180"
                      />
                    ))}
                </div>
              </TableHead>

              <TableHead className="p-4 text-main-text text-sm select-none hover:text-main-text transition-colors font-medium">
                <div
                  className="inline-flex items-center gap-x-1 cursor-pointer hover:text-secondary-text transition-colors"
                  onClick={() => handleSort("position")}
                >
                  {c("fields.position")}
                  {sortConfig?.field === "position" &&
                    (sortConfig.direction === "asc" ? (
                      <ArrowDown
                        size={12}
                        className="size-4 transition-transform duration-200 stroke-secondary-text"
                      />
                    ) : (
                      <ArrowDown
                        size={12}
                        className="size-4 transition-transform duration-200 stroke-secondary-text rotate-180"
                      />
                    ))}
                </div>
              </TableHead>

              <TableHead className="text-right py-4 w-12.5 min-w-12.5 max-w-12.5" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {displayed.map((emp) => {
              const isCurrentUser = emp.id === currentUserId;
              const canShowDropdown = showActions(emp.id);

              return (
                <TableRow
                  key={emp.id}
                  onClick={() => router.push(`/users/${emp.id}`)}
                  className="border-main-border font-normal min-h-16.25 hover:bg-active-sidebar-bg cursor-pointer"
                >
                  <TableCell className="p-4 w-20">
                    <Avatar className="h-10 w-10">
                      {emp.avatar && <AvatarImage src={emp.avatar} />}
                      <AvatarFallback className="text-xl bg-avatar-bg text-main-bg">
                        {emp.initials}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>

                  <TableCell className="text-sm text-main-text p-4">
                    {emp.firstName}
                  </TableCell>

                  <TableCell className="text-sm text-main-text p-4">
                    {emp.lastName}
                  </TableCell>

                  <TableCell className="text-sm text-main-text p-4">
                    {emp.email}
                  </TableCell>

                  <TableCell className="text-sm text-main-text p-4">
                    {emp.department ? (
                      <Badge
                        variant="outline"
                        className="px-2 py-0.5 rounded-md border bg-active-sidebar-bg border-main-border"
                      >
                        {emp.department}
                      </Badge>
                    ) : (
                      <span className="text-secondary-text text-sm">—</span>
                    )}
                  </TableCell>

                  <TableCell className="text-sm text-main-text p-4">
                    {emp.position}
                  </TableCell>

                  <TableCell className="text-right py-4 w-12.5 min-w-12.5 max-w-12.5">
                    <div className="flex items-center justify-end gap-1">
                      {canShowDropdown ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            asChild
                            className="hover:bg-active-sidebar-bg rounded-full"
                          >
                            <span
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 text-action-btn hover:accent-active-sidebar-bg transition-colors cursor-pointer inline-flex"
                            >
                              <MoreVertical className="size-5" />
                            </span>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-action-menu-bg w-full py-2 px-0 rounded-[4px] shadow-action-menu"
                          >
                            <DropdownMenuItem
                              className="py-1.5 px-4 cursor-pointer hover:bg-main-bg transition-colors text-base"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/users/${emp.id}`);
                              }}
                            >
                              {t("viewProfile")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="py-1.5 px-4 cursor-pointer hover:bg-main-bg transition-colors text-base"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingEmployee(emp);
                              }}
                            >
                              {t("updateAction")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <ChevronRight size={14} className="text-action-btn" />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {displayed.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-secondary-text">
            <Users size={32} className="mb-3 opacity-40" />
            <p className="text-sm">{t("noResults")}</p>
          </div>
        )}
      </div>

      {editingEmployee && (
        <UpdateUserModal
          open={!!editingEmployee}
          onClose={() => setEditingEmployee(null)}
          employee={editingEmployee}
          onUpdate={handleUpdate}
          departments={departments}
          positions={positions}
        />
      )}

      <CreateUserModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreate}
        departments={departments}
        positions={positions}
      />
    </>
  );
}
