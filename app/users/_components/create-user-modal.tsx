"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModalWrapper } from "@/components/ui/modal-wrapper";
import type { EmployeeCard } from "@/lib/users/users-types";

const ROLES = ["Employee", "Admin"];

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
  role: string;
};

export function CreateUserModal({ open, onClose, onCreate, departments, positions }: CreateUserModalProps) {
  const t = useTranslations("Users");
  const c = useTranslations("Common");
  
  const [form, setForm] = useState<CreateFormState>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    departmentId: departments[0]?.id ?? "",
    positionId: positions[0]?.id ?? "",
    role: ROLES[0],
  });

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleCreate = () => {
    const dept = departments.find(d => d.id === form.departmentId);
    const pos = positions.find(p => p.id === form.positionId);
    const initials = `${form.firstName.charAt(0)}${form.lastName.charAt(0)}`.toUpperCase() || "U";
    
    onCreate({
      id: Date.now(),
      email: form.email,
      firstName: form.firstName,
      lastName: form.lastName,
      department: dept?.name ?? "",
      position: pos?.name ?? "",
      avatar: null,
      initials,
      isVerified: false,
    });

    setForm({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      departmentId: departments[0]?.id ?? "",
      positionId: positions[0]?.id ?? "",
      role: ROLES[0],
    });
  };

  const fieldWrapper = "relative rounded-lg border border-white/15 bg-[#1e1e1e] focus-within:border-white/30 focus-within:ring-1 focus-within:ring-white/20 transition-all";
  const fieldLabel = "absolute left-3 -top-2.5 z-10 bg-[#1e1e1e] px-1.5 text-xs text-zinc-400 pointer-events-none select-none";
  const fieldInput = "w-full h-11 min-h-11 border-0 bg-transparent px-3 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0";

  return (
    <ModalWrapper open={open} onClose={onClose} title={t("createModalTitle")}>
      <div className="grid grid-cols-2 gap-4">
        <div className={fieldWrapper}>
          <Label className={fieldLabel}>{c("fields.email")}</Label>
          <Input value={form.email} onChange={(e) => set("email", e.target.value)} className={fieldInput} />
        </div>

        <div className={fieldWrapper}>
          <Label className={fieldLabel}>{c("fields.password")}</Label>
          <Input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="********" className={fieldInput} />
        </div>

        <div className={fieldWrapper}>
          <Label className={fieldLabel}>{c("fields.firstName")}</Label>
          <Input value={form.firstName} onChange={(e) => set("firstName", e.target.value)} className={fieldInput} />
        </div>

        <div className={fieldWrapper}>
          <Label className={fieldLabel}>{c("fields.lastName")}</Label>
          <Input value={form.lastName} onChange={(e) => set("lastName", e.target.value)} className={fieldInput} />
        </div>

        <div className={fieldWrapper}>
          <Label className={fieldLabel}>{c("fields.department")}</Label>
          <Select value={form.departmentId} onValueChange={(v) => set("departmentId", v)}>
            <SelectTrigger className={fieldInput}><SelectValue /></SelectTrigger>
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
            <SelectTrigger className={fieldInput}><SelectValue /></SelectTrigger>
            <SelectContent className="bg-[#1e1e1e] border-white/10 text-zinc-200">
              {positions.map((p) => (
                <SelectItem key={p.id} value={p.id} className="focus:bg-white/5">{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={fieldWrapper}>
          <Label className={fieldLabel}>{c("fields.role")}</Label>
          <Select value={form.role} onValueChange={(v) => set("role", v)}>
            <SelectTrigger className={fieldInput}><SelectValue /></SelectTrigger>
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
            className="flex-1 uppercase text-xs tracking-widest text-zinc-400 hover:text-zinc-200 bg-transparent hover:bg-white/5 border-white/10 rounded-4xl"
          >
            {c("actions.cancel")}
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!form.email || !form.password || !form.firstName || !form.lastName}
            className="flex-1 uppercase text-xs tracking-widest bg-zinc-700 hover:bg-zinc-600 text-zinc-100 border border-white/10 rounded-4xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {c("actions.create")}
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
}
