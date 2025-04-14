"use client";

import { useState } from "react";
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

const DEPARTMENTS = ["React", ".NET", "Blockchain", "DevOps", "Global", "Java", "Mobile"];
const POSITIONS = ["Software Engineer", "Network Engineer", "DevOps Engineer", "Data Analyst", "Project Manager"];
const ROLES = ["Employee", "Admin"];

type CreateUserModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (user: EmployeeCard) => void;
};

type CreateFormState = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department: string;
  position: string;
  role: string;
};

export function CreateUserModal({ open, onClose, onCreate }: CreateUserModalProps) {
  const [form, setForm] = useState<CreateFormState>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    department: DEPARTMENTS[0],
    position: POSITIONS[0],
    role: ROLES[0],
  });

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleCreate = () => {
    const initials = `${form.firstName.charAt(0)}${form.lastName.charAt(0)}`.toUpperCase() || "U";
    onCreate({
      id: Date.now(),
      email: form.email,
      firstName: form.firstName,
      lastName: form.lastName,
      department: form.department,
      position: form.position,
      avatar: null,
      initials,
      isVerified: false,
    });
    setForm({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      department: DEPARTMENTS[0],
      position: POSITIONS[0],
      role: ROLES[0],
    });
  };

  const fieldWrapper = "relative rounded-lg border border-white/15 bg-[#1e1e1e] focus-within:border-white/30 focus-within:ring-1 focus-within:ring-white/20 transition-all";
  const fieldLabel = "absolute left-3 -top-2.5 z-10 bg-[#1e1e1e] px-1.5 text-xs text-zinc-400 pointer-events-none select-none";
  const fieldInput = "w-full h-11 min-h-11 border-0 bg-transparent px-3 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0";

  return (
    <ModalWrapper open={open} onClose={onClose} title="Create user">
      <div className="grid grid-cols-2 gap-4">
        <div className={fieldWrapper}>
          <Label className={fieldLabel}>Email</Label>
          <Input value={form.email} onChange={(e) => set("email", e.target.value)} className={fieldInput} />
        </div>

        <div className={fieldWrapper}>
          <Label className={fieldLabel}>Password</Label>
          <Input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="********" className={fieldInput} />
        </div>

        <div className={fieldWrapper}>
          <Label className={fieldLabel}>First Name</Label>
          <Input value={form.firstName} onChange={(e) => set("firstName", e.target.value)} className={fieldInput} />
        </div>

        <div className={fieldWrapper}>
          <Label className={fieldLabel}>Last Name</Label>
          <Input value={form.lastName} onChange={(e) => set("lastName", e.target.value)} className={fieldInput} />
        </div>

        <div className={fieldWrapper}>
          <Label className={fieldLabel}>Department</Label>
          <Select value={form.department} onValueChange={(v) => set("department", v)}>
            <SelectTrigger className={fieldInput}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1e1e1e] border-white/10 text-zinc-200">
              {DEPARTMENTS.map((d) => (
                <SelectItem key={d} value={d} className="focus:bg-white/5">{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={fieldWrapper}>
          <Label className={fieldLabel}>Position</Label>
          <Select value={form.position} onValueChange={(v) => set("position", v)}>
            <SelectTrigger className={fieldInput}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1e1e1e] border-white/10 text-zinc-200">
              {POSITIONS.map((p) => (
                <SelectItem key={p} value={p} className="focus:bg-white/5">{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={fieldWrapper}>
          <Label className={fieldLabel}>Role</Label>
          <Select value={form.role} onValueChange={(v) => set("role", v)}>
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
            className="flex-1 uppercase text-xs tracking-widest text-zinc-400 hover:text-zinc-200 bg-transparent hover:bg-white/5 border-white/10 rounded-4xl"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!form.email || !form.password || !form.firstName || !form.lastName}
            className="flex-1 uppercase text-xs tracking-widest bg-zinc-700 hover:bg-zinc-600 text-zinc-100 border border-white/10 rounded-4xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
}
