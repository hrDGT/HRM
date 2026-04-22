"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ChevronRight, Upload, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EmployeeProfile } from "@/lib/users/users-types";
import { cn } from "@/lib/utils";

import {
  deleteAvatar,
  updateProfile,
  updateUserMeta,
  uploadAvatar,
} from "../actions";

import { ProfileTabs } from "./profile-tabs";

type UserProfileClientProps = {
  employee: EmployeeProfile;
  currentUserId: number;
  currentUserRole: string;
  departments: { id: string; name: string }[];
  positions: { id: string; name: string }[];
  userId: string;
};

export function UserProfileClient({
  employee,
  currentUserId,
  currentUserRole,
  departments,
  positions,
  userId,
}: UserProfileClientProps) {
  const t = useTranslations("Users");
  const c = useTranslations("Common");
  const router = useRouter();

  const TABS = [
    { id: "profile", label: t("tabs.profile"), href: `/users/${userId}` },
    { id: "skills", label: t("tabs.skills"), href: `/users/${userId}/skills` },
    {
      id: "languages",
      label: t("tabs.languages"),
      href: `/users/${userId}/languages`,
    },
  ];
  const initialDeptId =
    departments.find((d) => d.name === employee.department)?.id ?? null;
  const initialPosId =
    positions.find((p) => p.name === employee.position)?.id ?? null;

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
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    employee.avatar,
  );
  const [avatarFile, setAvatarFile] = useState<{
    base64: string;
    size: number;
    type: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canEdit =
    employee.id === currentUserId || currentUserRole?.toUpperCase() === "ADMIN";

  const set = (field: string, value: string | null) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      setError(t("fileSizeError"));
      return;
    }
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
    if (!confirm(t("deleteAvatarConfirm") || "Delete avatar?")) return;

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
        await uploadAvatar(
          employee.id,
          avatarFile.base64,
          avatarFile.size,
          avatarFile.type,
        );
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
        setOriginalValues({
          departmentId: form.departmentId,
          positionId: form.positionId,
        });
      }

      setIsDirty(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const fieldWrapper =
    "relative bg-transparent border-main-border focus-within:border-white/30 focus-within:ring-1 focus-within:ring-white/20 transition-all";
  const fieldLabel =
    "absolute left-3 -top-2.5 z-10 px-1.5 text-xs text-secondary-text pointer-events-none select-none";
  const fieldInput =
    "w-full min-h-12 px-3 text-base focus-visible:border-main-text hover:border-main-text bg-transparent";

  const fullName = [form.firstName, form.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  const nameDisplay = fullName || t("unnamedUser");
  const breadcrumbDisplay = fullName || form.email;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="flex items-center gap-2 px-8 py-4 text-sm">
        <Link
          href="/users"
          className="text-secondary-text text-base hover:underline transition-colors"
        >
          {t("title")}
        </Link>
        <ChevronRight size={16} className="text-zinc-600" />
        <span className="text-primary text-base">{breadcrumbDisplay}</span>
      </div>

      <div className="px-8 pb-6">
        <ProfileTabs tabs={TABS} userId={userId} />
      </div>

      <div className="flex-1 px-8 pb-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex justify-center items-center gap-6">
            <div className="relative group">
              <Avatar className="h-30 w-30 shrink-0">
                {avatarPreview && (
                  <AvatarImage src={avatarPreview} alt={nameDisplay} />
                )}
                <AvatarFallback className="bg-avatar-bg text-main-bg text-3xl font-bold">
                  {form.initials ||
                    (form.firstName?.[0] || "") + (form.lastName?.[0] || "")}
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
                  <X className="w-10 h-10 text-primary" />
                </button>
              )}
            </div>

            {canEdit && (
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
                  <div className="flex items-center gap-2 text-main-text">
                    <Upload size={25} className="text-main-text" />
                    <span className="text-xl font-medium">
                      {t("uploadAvatar")}
                    </span>
                  </div>
                  <p className="text-base text-secondary-text">
                    {t("uploadHint")}
                  </p>
                </button>
              </>
            )}
          </div>

          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold text-main-text">
              {nameDisplay}
            </h1>
            <p className="text-base text-secondary-text">{form.email}</p>
            {employee.memberSince && (
              <p className="text-base text-main-text">
                {t("memberSince", { date: employee.memberSince })}
              </p>
            )}
          </div>

          {error && (
            <p className="text-center text-sm text-destructive">{error}</p>
          )}

          <fieldset
            disabled={!canEdit}
            className="grid grid-cols-2 gap-8 pt-4 disabled:opacity-60 disabled:cursor-not-allowed"
          >
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
                value={form.departmentId ?? ""}
                onValueChange={(v) => {
                  const dept = departments.find((d) => d.id === v);
                  if (dept) {
                    set("departmentId", dept.id);
                    set("department", dept.name);
                  }
                }}
                disabled={!canEdit}
              >
                <SelectTrigger className={cn(fieldInput, "cursor-pointer")}>
                  <SelectValue
                    placeholder={c("placeholders.selectDepartment")}
                  />
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
                value={form.positionId ?? ""}
                onValueChange={(v) => {
                  const pos = positions.find((p) => p.id === v);
                  if (pos) {
                    set("positionId", pos.id);
                    set("position", pos.name);
                  }
                }}
                disabled={!canEdit}
              >
                <SelectTrigger className={cn(fieldInput, "cursor-pointer")}>
                  <SelectValue placeholder={c("placeholders.selectPosition")} />
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
          </fieldset>

          {canEdit && (
            <div className="flex justify-end pt-4">
              <div className="w-1/2 flex gap-3">
                <Button
                  onClick={handleUpdate}
                  disabled={!isDirty || isSaving}
                  className={cn(
                    "flex-1 uppercase text-sm tracking-widest rounded-4xl transition-all",
                    !isDirty || isSaving
                      ? "disabled:pointer-events-none disabled:text-disabled-btn disabled:border-transparent disabled:shadow-none"
                      : "uppercase min-w-50 min-h-12 rounded-4xl max-h-10 bg-primary border-transparent text-white shadow-btn hover:bg-hover-action-submit-btn w-full sm:w-auto",
                  )}
                >
                  {isSaving ? c("actions.saving") : c("actions.update")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
