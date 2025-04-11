"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Upload, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { cn } from "@/lib/utils";
import type { EmployeeProfile } from "@/lib/users/users-types";
import { updateProfile, updateUserMeta, uploadAvatar } from "../actions";

const DEPARTMENTS = [
  { id: 1, name: "React" },
  { id: 2, name: ".NET" },
  { id: 3, name: "Blockchain" },
  { id: 4, name: "DevOps" },
  { id: 5, name: "Global" },
  { id: 6, name: "Java" },
  { id: 7, name: "Mobile" }
];

const POSITIONS = [
  { id: 1, name: "Software Engineer" },
  { id: 2, name: "Network Engineer" },
  { id: 3, name: "DevOps Engineer" },
  { id: 4, name: "Data Analyst" },
  { id: 5, name: "Project Manager" }
];

const TABS = [
  { id: "profile", label: "PROFILE" },
  { id: "skills", label: "SKILLS" },
  { id: "languages", label: "LANGUAGES" },
];

type UserProfileClientProps = {
  employee: EmployeeProfile;
  currentUserId: number;
};

export function UserProfileClient({ employee, currentUserId }: UserProfileClientProps) {
  const [activeTab, setActiveTab] = useState("profile");
  const [form, setForm] = useState({
    ...employee,
    departmentId: (employee as any).departmentId ?? null,
    positionId: (employee as any).positionId ?? null,
  });
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(employee.avatar);
  const [avatarFile, setAvatarFile] = useState<{ base64: string; size: number; type: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isOwnProfile = employee.id === currentUserId;

  const set = (field: string, value: string | number | null) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      setError("File must be no more than 1MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(",")[1];
      setAvatarPreview(dataUrl);
      setAvatarFile({ base64, size: file.size, type: file.type });
      setIsDirty(true);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async () => {
    setIsSaving(true);
    setError(null);
    try {
      if (avatarFile) {
        await uploadAvatar(employee.id, avatarFile.base64, avatarFile.size, avatarFile.type);
        setAvatarFile(null);
      }

      const [profileUpdated, userUpdated] = await Promise.all([
        updateProfile(employee.id, form.firstName, form.lastName),
        updateUserMeta(employee.id, form.departmentId, form.positionId)
      ]);

      if (profileUpdated || userUpdated) {
        setForm((prev) => ({
          ...prev,
          firstName: profileUpdated?.first_name ?? prev.firstName,
          lastName: profileUpdated?.last_name ?? prev.lastName,
          department: userUpdated?.department_name ?? prev.department,
          position: userUpdated?.position_name ?? prev.position,
        }));
      }

      setIsDirty(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const fieldWrapper = "relative rounded-lg border border-white/15 bg-[#353535] focus-within:border-white/30 focus-within:ring-1 focus-within:ring-white/20 transition-all";
  const fieldLabel = "absolute left-3 -top-2.5 z-10 bg-[#353535] px-1.5 text-[10px] uppercase tracking-wider text-zinc-500";
  const fieldInput = "w-full h-11 min-h-11 border-0 bg-transparent px-3 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0";

  const nameDisplay = form.firstName || form.lastName
    ? `${form.firstName} ${form.lastName}`.trim()
    : "Unnamed User";
  const breadcrumbDisplay = form.firstName || form.lastName
    ? `${form.firstName} ${form.lastName}`.trim()
    : form.email;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#353535]">
      <div className="flex items-center gap-2 px-8 py-4 text-sm">
        <Link href="/users" className="text-zinc-400 hover:text-zinc-200 transition-colors">
          Employees
        </Link>
        <ChevronRight size={16} className="text-zinc-600" />
        <span className="text-red-500">{breadcrumbDisplay}</span>
      </div>

      <div className="px-8 pb-6">
        <div className="flex gap-8 border-b border-white/10">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "pb-3 text-xs font-semibold tracking-wider transition-colors relative",
                activeTab === tab.id
                  ? "text-red-500"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "profile" && (
        <div className="flex-1 px-8 pb-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-center items-center gap-6">
              <Avatar className="h-24 w-24 flex-shrink-0">
                {avatarPreview && <AvatarImage src={avatarPreview} alt={nameDisplay} />}
                <AvatarFallback className="bg-zinc-700 text-zinc-300 text-3xl font-bold">
                  {form.initials || (form.firstName?.[0] || "") + (form.lastName?.[0] || "")}
                </AvatarFallback>
              </Avatar>

              {isOwnProfile && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/gif"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="space-y-1 text-left hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-zinc-200">
                      <Upload size={18} className="text-zinc-400" />
                      <span className="text-sm font-medium">Upload avatar image</span>
                    </div>
                    <p className="text-xs text-zinc-500">png, jpg or gif no more than 1MB</p>
                  </button>
                </>
              )}
            </div>

            <div className="text-center space-y-1">
              <h1 className="text-xl font-semibold text-zinc-100">{nameDisplay}</h1>
              <p className="text-sm text-zinc-400">{form.email}</p>
              {employee.memberSince && (
                <p className="text-xs text-zinc-500">A member since {employee.memberSince}</p>
              )}
            </div>

            {error && (
              <p className="text-center text-sm text-red-400">{error}</p>
            )}

            <fieldset
              disabled={!isOwnProfile}
              className="grid grid-cols-2 gap-4 pt-4 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div className={fieldWrapper}>
                <Label className={fieldLabel}>First Name</Label>
                <Input
                  value={form.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                  className={fieldInput}
                />
              </div>

              <div className={fieldWrapper}>
                <Label className={fieldLabel}>Last Name</Label>
                <Input
                  value={form.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                  className={fieldInput}
                />
              </div>

              <div className={fieldWrapper}>
                <Label className={fieldLabel}>Department</Label>
                <Select
                  value={form.departmentId?.toString() ?? ""}
                  onValueChange={(v) => {
                    const dept = DEPARTMENTS.find(d => d.id === Number(v));
                    if (dept) {
                      set("departmentId", dept.id);
                      set("department", dept.name);
                    }
                  }}
                  disabled={!isOwnProfile}
                >
                  <SelectTrigger className={fieldInput}>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#353535] border-white/10 text-zinc-200">
                    {DEPARTMENTS.map((d) => (
                      <SelectItem key={d.id} value={d.id.toString()} className="focus:bg-white/5">{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className={fieldWrapper}>
                <Label className={fieldLabel}>Position</Label>
                <Select
                  value={form.positionId?.toString() ?? ""}
                  onValueChange={(v) => {
                    const pos = POSITIONS.find(p => p.id === Number(v));
                    if (pos) {
                      set("positionId", pos.id);
                      set("position", pos.name);
                    }
                  }}
                  disabled={!isOwnProfile}
                >
                  <SelectTrigger className={fieldInput}>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#353535] border-white/10 text-zinc-200">
                    {POSITIONS.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()} className="focus:bg-white/5">{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </fieldset>

            {isOwnProfile && (
              <div className="flex justify-end pt-4">
                <div className="w-1/2 flex gap-3">
                  <Button
                    onClick={handleUpdate}
                    disabled={!isDirty || isSaving}
                    className={cn(
                      "flex-1 uppercase text-xs tracking-widest rounded-4xl transition-all",
                      !isDirty || isSaving
                        ? "bg-zinc-500 text-zinc-200 cursor-not-allowed border border-white/5"
                        : "bg-zinc-700 hover:bg-zinc-600 text-zinc-100 border border-white/10"
                    )}
                  >
                    {isSaving ? "Saving..." : "Update"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "skills" && <div>TODO</div>}
      {activeTab === "languages" && <div>TODO</div>}
    </div>
  );
}
