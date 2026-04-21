"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ChevronRight,
  ChevronUp,
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
      <div className="px-6 pt-5 pb-4 border-white/5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">
            {t("title")}
          </p>
          {currentUserRole === "Admin" && (
            <Button
              data-testid="create-user-button"
              onClick={() => setIsCreateOpen(true)}
              className="h-7 px-2 text-xs font-semibold tracking-wider bg-transparent border-0 shadow-none text-red-500 hover:text-red-400"
            >
              <Plus size={14} className="mr-1.5" />
              {t("createUserButton")}
            </Button>
          )}
        </div>
        <div className="relative max-w-xs">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={c("placeholders.search")}
            className="pl-8 h-9 border-white/10 rounded-4xl text-sm text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:border-white/20"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="w-10" />

              <TableHead
                className="text-zinc-400 text-xs font-semibold uppercase tracking-wider cursor-pointer select-none hover:text-zinc-200 transition-colors"
                onClick={() => handleSort("firstName")}
              >
                <span className="flex items-center gap-1">
                  {c("fields.firstName")}
                  {sortConfig?.field === "firstName" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp size={12} className="text-zinc-300" />
                    ) : (
                      <ChevronUp
                        size={12}
                        className="text-zinc-300 rotate-180"
                      />
                    ))}
                </span>
              </TableHead>

              <TableHead
                className="text-zinc-400 text-xs font-semibold uppercase tracking-wider cursor-pointer select-none hover:text-zinc-200 transition-colors"
                onClick={() => handleSort("lastName")}
              >
                <span className="flex items-center gap-1">
                  {c("fields.lastName")}
                  {sortConfig?.field === "lastName" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp size={12} className="text-zinc-300" />
                    ) : (
                      <ChevronUp
                        size={12}
                        className="text-zinc-300 rotate-180"
                      />
                    ))}
                </span>
              </TableHead>

              <TableHead
                className="text-zinc-400 text-xs font-semibold uppercase tracking-wider cursor-pointer select-none hover:text-zinc-200 transition-colors"
                onClick={() => handleSort("email")}
              >
                <span className="flex items-center gap-1">
                  {c("fields.email")}
                  {sortConfig?.field === "email" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp size={12} className="text-zinc-300" />
                    ) : (
                      <ChevronUp
                        size={12}
                        className="text-zinc-300 rotate-180"
                      />
                    ))}
                </span>
              </TableHead>

              <TableHead
                className="text-zinc-400 text-xs font-semibold uppercase tracking-wider cursor-pointer select-none hover:text-zinc-200 transition-colors"
                onClick={() => handleSort("department")}
              >
                <span className="flex items-center gap-1">
                  {c("fields.department")}
                  {sortConfig?.field === "department" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp size={12} className="text-zinc-300" />
                    ) : (
                      <ChevronUp
                        size={12}
                        className="text-zinc-300 rotate-180"
                      />
                    ))}
                </span>
              </TableHead>

              <TableHead
                className="text-zinc-400 text-xs font-semibold uppercase tracking-wider cursor-pointer select-none hover:text-zinc-200 transition-colors"
                onClick={() => handleSort("position")}
              >
                <span className="flex items-center gap-1">
                  {c("fields.position")}
                  {sortConfig?.field === "position" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp size={12} className="text-zinc-300" />
                    ) : (
                      <ChevronUp
                        size={12}
                        className="text-zinc-300 rotate-180"
                      />
                    ))}
                </span>
              </TableHead>

              <TableHead className="w-10" />
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
                  className="border-white/5 hover:bg-white/[0.03] cursor-pointer transition-colors"
                >
                  <TableCell className="py-3">
                    <Avatar className="h-8 w-8">
                      {emp.avatar && <AvatarImage src={emp.avatar} />}
                      <AvatarFallback className="text-xs font-semibold bg-zinc-700 text-zinc-300">
                        {emp.initials}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>

                  <TableCell className="text-sm text-zinc-200 py-3 font-medium">
                    {emp.firstName}
                  </TableCell>

                  <TableCell className="text-sm text-zinc-200 py-3">
                    {emp.lastName}
                  </TableCell>

                  <TableCell className="text-sm text-zinc-400 py-3">
                    {emp.email}
                  </TableCell>

                  <TableCell className="py-3">
                    {emp.department ? (
                      <Badge
                        variant="outline"
                        className="text-xs font-medium px-2 py-0.5 rounded-md border bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                      >
                        {emp.department}
                      </Badge>
                    ) : (
                      <span className="text-zinc-600 text-sm">—</span>
                    )}
                  </TableCell>

                  <TableCell className="text-sm text-zinc-300 py-3">
                    {emp.position}
                  </TableCell>

                  <TableCell className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {canShowDropdown ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <span
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-200 transition-colors cursor-pointer inline-flex"
                            >
                              <MoreVertical size={14} />
                            </span>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-[#353535] border-white/10 text-zinc-200 text-sm min-w-35"
                          >
                            <DropdownMenuItem
                              className="cursor-pointer hover:bg-white/5 focus:bg-white/5"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/users/${emp.id}`);
                              }}
                            >
                              {t("viewProfile")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer hover:bg-white/5 focus:bg-white/5"
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
                        <ChevronRight size={14} className="text-zinc-600" />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {displayed.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-600">
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
