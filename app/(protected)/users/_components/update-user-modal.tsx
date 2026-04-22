"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

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
import {
  updateProfile,
  updateUserMeta,
} from "@/app/(protected)/users/actions";
import { UserRole } from "@/gqlcodegen/graphql";

const ROLES: UserRole[] = [UserRole.Employee, UserRole.Admin];

type UpdateUserModalProps = {
  open: boolean;
  onClose: () => void;
  employee: EmployeeCard;
  onUpdate: (updated: EmployeeCard) => void;
  departments: { id: string; name: string }[];
  positions: { id: string; name: string }[];
};

type UpdateFormState = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  departmentId: string;
  positionId: string;
  role: UserRole;
};

export function UpdateUserModal({
  open,
  onClose,
  employee,
  onUpdate,
  departments,
  positions,
}: UpdateUserModalProps) {
  const t = useTranslations("Users");
  const c = useTranslations("Common");
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const initialDeptId = departments.find((d) => d.name === employee.department)?.id ?? "";
  const initialPosId = positions.find((p) => p.name === employee.position)?.id ?? "";

  const [form, setForm] = useState<UpdateFormState>({
    email: employee.email,
    password: "",
    firstName: employee.firstName,
    lastName: employee.lastName,
    departmentId: initialDeptId,
    positionId: initialPosId,
    role: UserRole.Employee,
  });

  const set = (field: keyof UpdateFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }) as UpdateFormState);
    setIsDirty(true);
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await updateProfile(employee.id, form.firstName, form.lastName);
      await updateUserMeta(
        employee.id,
        form.departmentId ? Number(form.departmentId) : null,
        form.positionId ? Number(form.positionId) : null,
      );

      const updatedDept = departments.find((d) => d.id === form.departmentId)?.name ?? employee.department;
      const updatedPos = positions.find((p) => p.id === form.positionId)?.name ?? employee.position;

      onUpdate({
        ...employee,
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        department: updatedDept,
        position: updatedPos,
      });

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fieldWrapper =
    "group relative rounded-lg border border-white/15 bg-[#2c2c2c] focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500/20 transition-all duration-300";
  const fieldLabel =
    "absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:-top-2.5 group-focus-within:translate-y-0 bg-[#2c2c2c] px-1.5 text-xs text-red-500 pointer-events-none select-none opacity-0 group-focus-within:opacity-100 transition-all duration-300 ease-in-out";
  const fieldInput =
    "w-full h-11 min-h-11 border-0 bg-transparent px-3 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:transition-opacity duration-300 group-focus-within:placeholder:opacity-0";

  return (
    <ModalWrapper open={open} onClose={onClose} title={t("updateModalTitle")} aria-describedby={undefined}>
      <div className="grid grid-cols-2 gap-4">
        <div className={fieldWrapper}>
          <Label className={fieldLabel}>{c("fields.email")}</Label>
          <Input value={form.email} onChange={(e) => set("email", e.target.value)} className={fieldInput} placeholder={c("fields.email")} />
        </div>

        <div className={fieldWrapper}>
          <Label className={fieldLabel}>{c("fields.password")}</Label>
          <Input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="********" className={fieldInput} />
        </div>

        <div className={fieldWrapper}>
          <Label className={fieldLabel}>{c("fields.firstName")}</Label>
          <Input value={form.firstName} onChange={(e) => set("firstName", e.target.value)} className={fieldInput} placeholder={c("fields.firstName")} />
        </div>

        <div className={fieldWrapper}>
          <Label className={fieldLabel}>{c("fields.lastName")}</Label>
          <Input value={form.lastName} onChange={(e) => set("lastName", e.target.value)} className={fieldInput} placeholder={c("fields.lastName")} />
        </div>

        <div className={fieldWrapper}>
          <Label className={fieldLabel}>{c("fields.department")}</Label>
          <Select value={form.departmentId} onValueChange={(v) => set("departmentId", v)}>
            <SelectTrigger className={fieldInput}>
              <SelectValue placeholder={c("placeholders.selectDepartment")} />
            </SelectTrigger>
            <SelectContent className="bg-[#1e1e1e] border-white/10 text-zinc-200">
              {departments.map((d) => (
                <SelectItem key={d.id} value={d.id} className="focus:bg-white/5">{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={fieldWrapper}>
          <Label className={fieldLabel}>{c("fields.position")}</Label>
          <Select value={form.positionId} onValueChange={(v) => set("positionId", v)}>
            <SelectTrigger className={fieldInput}>
              <SelectValue placeholder={c("placeholders.selectPosition")} />
            </SelectTrigger>
            <SelectContent className="bg-[#1e1e1e] border-white/10 text-zinc-200">
              {positions.map((p) => (
                <SelectItem key={p.id} value={p.id} className="focus:bg-white/5">{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={fieldWrapper}>
          <Label className={fieldLabel}>{c("fields.role")}</Label>
          <Select value={form.role} onValueChange={(v) => set("role", v as UserRole)}>
            <SelectTrigger className={fieldInput}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1e1e1e] border-white/10 text-zinc-200">
              {ROLES.map((r) => (
                <SelectItem key={r} value={r} className="focus:bg-white/5">{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end w-full mt-6 pt-4 border-white/10">
        <div className="w-1/2 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 uppercase text-xs tracking-widest text-zinc-400 hover:text-zinc-200 bg-transparent hover:bg-white/5 border-white/10 rounded-4xl"
          >
            {c("actions.cancel")}
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={!isDirty || isLoading}
            className={cn(
              "flex-1 uppercase text-xs tracking-widest rounded-4xl transition-all duration-300",
              (!isDirty || isLoading)
                ? "bg-zinc-600 text-zinc-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 text-zinc-100 cursor-pointer"
            )}
          >
            {isLoading ? c("actions.saving") : c("actions.update")}
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
}
