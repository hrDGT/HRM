"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Upload, ChevronRight, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { EmployeeProfile } from "@/lib/users/users-types";
import { updateProfile, updateUserMeta, uploadAvatar, deleteAvatar } from "../actions";
import { ProfileTabs } from "./profile-tabs";
import { UserSkills } from "./user-skills";

type UserProfileClientProps = {
  employee: EmployeeProfile;
  currentUserId: number;
  currentUserRole: string;
  departments: { id: string; name: string }[];
  positions: { id: string; name: string }[];
};

export function UserProfileClient({
  employee, currentUserId, currentUserRole,
  departments, positions,
}: UserProfileClientProps) {
  const t = useTranslations("Users");
  const c = useTranslations("Common");

  const TABS = [
    { id: "profile", label: t("tabs.profile") },
    { id: "skills", label: t("tabs.skills") },
    { id: "languages", label: t("tabs.languages") },
  ];

  const initialDeptId = departments.find(d => d.name === employee.department)?.id ?? null;
  const initialPosId = positions.find(p => p.name === employee.position)?.id ?? null;

  const [activeTab, setActiveTab] = useState("profile");
  const [form, setForm] = useState({
    ...employee,
    departmentId: initialDeptId,
    positionId: initialPosId,
  });
  const [originalValues, setOriginalValues] = useState({
    departmentId: initialDeptId,
    positionId: initialPosId,
  });
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(employee.avatar);
  const [avatarFile, setAvatarFile] = useState<{ base64: string; size: number; type: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canEdit = employee.id === currentUserId || currentUserRole?.toUpperCase() === "ADMIN";
  const router = useRouter();

  const set = (field: string, value: string | null) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) { setError(t("fileSizeError")); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAvatarPreview(dataUrl);
      setAvatarFile({ base64: dataUrl, size: file.size, type: file.type });
      setIsDirty(true);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteAvatar = async () => {
    if (!confirm(t("deleteAvatarConfirm"))) return;
    
    setIsDeleting(true);
    setError(null);
    try {
      await deleteAvatar(employee.id);
      setAvatarPreview(null);
      setAvatarFile(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete avatar");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async () => {
    setIsSaving(true);
    setError(null);
    try {
      if (avatarFile) {
        await uploadAvatar(employee.id, avatarFile.base64, avatarFile.size, avatarFile.type);
        setAvatarFile(null);
      }

      await updateProfile(employee.id, form.firstName, form.lastName);

      const hasDeptChange = form.departmentId !== originalValues.departmentId;
      const hasPosChange = form.positionId !== originalValues.positionId;

      if (hasDeptChange || hasPosChange) {
        await updateUserMeta(
          employee.id,
          form.departmentId != null ? Number(form.departmentId) : null,
          form.positionId != null ? Number(form.positionId) : null,
        );
        setOriginalValues({ departmentId: form.departmentId, positionId: form.positionId });
      }

      setIsDirty(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const fieldWrapper = "relative rounded-lg border border-white/15 bg-[#353535] focus-within:border-white/30 focus-within:ring-1 focus-within:ring-white/20 transition-all";
  const fieldLabel = "absolute left-3 -top-2.5 z-10 bg-[#353535] px-1.5 text-[10px] uppercase tracking-wider text-zinc-500";
  const fieldInput = "w-full h-11 min-h-11 border-0 bg-transparent px-3 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0";

  const fullName = [form.firstName, form.lastName].filter(Boolean).join(" ").trim();
  const nameDisplay = fullName || t("unnamedUser");
  const breadcrumbDisplay = fullName || form.email;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#353535]">
      <div className="flex items-center gap-2 px-8 py-4 text-sm">
        <Link href="/users" className="text-zinc-400 hover:text-zinc-200 transition-colors">
          {t("title")}
        </Link>
        <ChevronRight size={16} className="text-zinc-600" />
        <span className="text-red-500">{breadcrumbDisplay}</span>
      </div>

      <div className="px-8 pb-6">
        <ProfileTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {activeTab === "profile" && (
        <div className="flex-1 px-8 pb-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-center items-center gap-6">
              <div className="relative group">
                <Avatar className="h-24 w-24 flex-shrink-0">
                  {avatarPreview && <AvatarImage src={avatarPreview} alt={nameDisplay} />}
                  <AvatarFallback className="bg-zinc-700 text-zinc-300 text-3xl font-bold">
                    {form.initials || (form.firstName?.[0] || "") + (form.lastName?.[0] || "")}
                  </AvatarFallback>
                </Avatar>

                {canEdit && avatarPreview && (
                  <button
                    type="button"
                    onClick={handleDeleteAvatar}
                    disabled={isDeleting}
                    className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                    title={t("deleteAvatarTitle")}
                  >
                    <X className="w-10 h-10 text-red-500" />
                  </button>
                )}
              </div>
              
              {canEdit && (
                <>
                  <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/gif"
                    className="hidden" onChange={handleAvatarChange} />
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="space-y-1 text-left hover:opacity-80 transition-opacity cursor-pointer">
                    <div className="flex items-center gap-2 text-zinc-200">
                      <Upload size={18} className="text-zinc-400" />
                      <span className="text-sm font-medium">{t("uploadAvatar")}</span>
                    </div>
                    <p className="text-xs text-zinc-500">{t("uploadHint")}</p>
                  </button>
                </>
              )}
            </div>

            <div className="text-center space-y-1">
              <h1 className="text-xl font-semibold text-zinc-100">{nameDisplay}</h1>
              <p className="text-sm text-zinc-400">{form.email}</p>
              {employee.memberSince && <p className="text-xs text-zinc-500">{t("memberSince", { date: employee.memberSince })}</p>}
            </div>

            {error && <p className="text-center text-sm text-red-400">{error}</p>}

            <fieldset disabled={!canEdit}
              className="grid grid-cols-2 gap-4 pt-4 disabled:opacity-60 disabled:cursor-not-allowed">
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
                <Select
                  value={form.departmentId ?? ""}
                  onValueChange={(v) => {
                    const dept = departments.find(d => d.id === v);
                    if (dept) { set("departmentId", dept.id); set("department", dept.name); }
                  }}
                  disabled={!canEdit}
                >
                  <SelectTrigger className={fieldInput}>
                    <SelectValue placeholder={c("placeholders.selectDepartment")} />
                  </SelectTrigger>
                  <SelectContent className="bg-[#353535] border-white/10 text-zinc-200">
                    {departments.map((d) => (
                      <SelectItem key={d.id} value={d.id} className="focus:bg-white/5">{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className={fieldWrapper}>
                <Label className={fieldLabel}>{c("fields.position")}</Label>
                <Select
                  value={form.positionId ?? ""}
                  onValueChange={(v) => {
                    const pos = positions.find(p => p.id === v);
                    if (pos) { set("positionId", pos.id); set("position", pos.name); }
                  }}
                  disabled={!canEdit}
                >
                  <SelectTrigger className={fieldInput}>
                    <SelectValue placeholder={c("placeholders.selectPosition")} />
                  </SelectTrigger>
                  <SelectContent className="bg-[#353535] border-white/10 text-zinc-200">
                    {positions.map((p) => (
                      <SelectItem key={p.id} value={p.id} className="focus:bg-white/5">{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </fieldset>

            {canEdit && (
              <div className="flex justify-end pt-4">
                <div className="w-1/2 flex gap-3">
                  <Button onClick={handleUpdate} disabled={!isDirty || isSaving}
                    className={cn("flex-1 uppercase text-xs tracking-widest rounded-4xl transition-all",
                      !isDirty || isSaving
                        ? "bg-zinc-500 text-zinc-200 cursor-not-allowed border border-white/5"
                        : "bg-zinc-700 hover:bg-zinc-600 text-zinc-100 border border-white/10"
                    )}>
                    {isSaving ? c("actions.saving") : c("actions.update")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "skills" && (
        <UserSkills 
          userId={employee.id} 
          canEdit={canEdit}
        />
      )}

      {activeTab === "languages" && (
        <div className="px-8 pb-8 flex items-center justify-center min-h-[200px] text-zinc-500">
          {t("languagesComingSoon")}
        </div>
      )}
    </div>
  );
}
