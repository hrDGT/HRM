"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModalWrapper } from "@/components/ui/modal-wrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EmployeeCard } from "@/lib/users/users-types";
import { cn } from "@/lib/utils";
import { createUser } from "@/app/(protected)/users/[id]/actions";
import { UserRole } from "@/gqlcodegen/graphql";

const ROLES: UserRole[] = [UserRole.Employee, UserRole.Admin];

type CreateUserModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (user: EmployeeCard) => void;
  departments: { id: string; name: string }[];
  positions: { id: string; name: string }[];
};

type CreateFormState = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  departmentId: string;
  positionId: string;
  role: UserRole;
};

export function CreateUserModal({
  open,
  onClose,
  onCreate,
  departments,
  positions,
}: CreateUserModalProps) {
  const t = useTranslations("Users");
  const c = useTranslations("Common");

  const [form, setForm] = useState<CreateFormState>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    departmentId: departments[0]?.id ?? "",
    positionId: positions[0]?.id ?? "",
    role: UserRole.Employee,
  });

  const set = (field: keyof CreateFormState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }) as CreateFormState);

  const handleCreate = async () => {
    const created = await createUser({
      email: form.email,
      password: form.password,
      firstName: form.firstName,
      lastName: form.lastName,
      departmentId: form.departmentId || undefined,
      positionId: form.positionId || undefined,
      role: form.role,
    });

    const initials =
      `${form.firstName.charAt(0)}${form.lastName.charAt(0)}`.toUpperCase();

    onCreate({
      id: Number(created.id),
      email: created.email,
      firstName: created.profile.first_name,
      lastName: created.profile.last_name,
      department: created.department_name ?? "",
      position: created.position_name ?? "",
      avatar: created.profile.avatar,
      initials,
      isVerified: created.is_verified,
    });

    setForm({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      departmentId: departments[0]?.id ?? "",
      positionId: positions[0]?.id ?? "",
      role: UserRole.Employee,
    });

    onClose();
  };

  const fieldWrapper =
    "relative bg-transparent border-main-border focus-within:border-white/30 focus-within:ring-1 focus-within:ring-white/20 transition-all";
  const fieldLabel =
    "absolute left-3 -top-2.5 z-10 px-1.5 text-xs text-secondary-text pointer-events-none select-none";
  const fieldInput =
    "w-full min-h-12 px-3 text-base focus-visible:border-main-text hover:border-main-text bg-transparent";

  return (
    <ModalWrapper open={open} onClose={onClose} title={t("createModalTitle")}>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className={fieldWrapper}>
          <Label className={fieldLabel}>{c("fields.email")}</Label>
          <Input
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className={fieldInput}
            placeholder={c("fields.email")}
          />
        </div>

        <div className={fieldWrapper}>
          <Label className={fieldLabel}>{c("fields.password")}</Label>
          <Input
            type="password"
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            placeholder="********"
            className={fieldInput}
          />
        </div>

        <div className={fieldWrapper}>
          <Label className={fieldLabel}>{c("fields.firstName")}</Label>
          <Input
            value={form.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            className={fieldInput}
            placeholder={c("fields.firstName")}
          />
        </div>

        <div className={fieldWrapper}>
          <Label className={fieldLabel}>{c("fields.lastName")}</Label>
          <Input
            value={form.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            className={fieldInput}
            placeholder={c("fields.lastName")}
          />
        </div>

        <div className={fieldWrapper}>
          <Label className={fieldLabel}>{c("fields.department")}</Label>
          <Select
            value={form.departmentId}
            onValueChange={(v) => set("departmentId", v)}
          >
            <SelectTrigger className={cn(fieldInput, "cursor-pointer")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="shadow-action-menu bg-action-menu-bg py-2">
              {departments.map((d) => (
                <SelectItem
                  key={d.id}
                  value={d.id}
                  className="p-2 text-base focus-visible:border-main-text hover:bg-active-sidebar-bg cursor-pointer data-[state=checked]:bg-select-checked"
                >
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={fieldWrapper}>
          <Label className={fieldLabel}>{c("fields.position")}</Label>
          <Select
            value={form.positionId}
            onValueChange={(v) => set("positionId", v)}
          >
            <SelectTrigger className={cn(fieldInput, "cursor-pointer")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="shadow-action-menu bg-action-menu-bg py-2">
              {positions.map((p) => (
                <SelectItem
                  key={p.id}
                  value={p.id}
                  className="p-2 text-base focus-visible:border-main-text hover:bg-active-sidebar-bg cursor-pointer data-[state=checked]:bg-select-checked"
                >
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={fieldWrapper}>
          <Label className={fieldLabel}>{c("fields.role")}</Label>
          <Select
            value={form.role}
            onValueChange={(v) => set("role", v as UserRole)}
          >
            <SelectTrigger className={cn(fieldInput, "cursor-pointer")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="shadow-action-menu bg-action-menu-bg py-2">
              {ROLES.map((r) => (
                <SelectItem
                  key={r}
                  value={r}
                  className="p-2 text-base focus-visible:border-main-text hover:bg-active-sidebar-bg cursor-pointer data-[state=checked]:bg-select-checked"
                >
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex flex-col justify-center items-center w-full sm:flex-row sm:justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full min-w-50 min-h-12 text-secondary-text rounded-4xl uppercase hover:bg-modal-cancel-btn sm:w-auto"
          >
            {c("actions.cancel")}
          </Button>
          <Button
            onClick={handleCreate}
            disabled={
              !form.email || !form.password || !form.firstName || !form.lastName
            }
            className="w-full uppercase min-w-50 min-h-12 rounded-4xl max-h-10 bg-primary border-transparent text-white shadow-btn hover:bg-hover-action-submit-btn sm:w-auto"
          >
            {c("actions.create")}
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
}
