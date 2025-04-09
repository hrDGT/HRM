"use client";

import { useState } from "react";
import Link from "next/link";
import { Upload, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import type { Employee } from "../page";

const DEPARTMENTS = ["React", ".NET", "Blockchain", "DevOps", "Global", "Java", "Mobile"];
const POSITIONS = ["Software Engineer", "Network Engineer", "DevOps Engineer", "Data Analyst", "Project Manager"];

const TABS = [
  { id: "profile", label: "PROFILE" },
  { id: "skills", label: "SKILLS" },
  { id: "languages", label: "LANGUAGES" },
];

type UserProfileClientProps = {
  employee: Employee;
  currentUserId: number;
};

export function UserProfileClient({ employee, currentUserId }: UserProfileClientProps) {
  const [activeTab, setActiveTab] = useState("profile");
  const [form, setForm] = useState(employee);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const isOwnProfile = employee.id === currentUserId;

  const set = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      console.log("Updating:", form);
      setIsDirty(false);
    } finally {
      setIsSaving(false);
    }
  };

  const fieldWrapper = "relative rounded-lg border border-white/15 bg-[#353535] focus-within:border-white/30 focus-within:ring-1 focus-within:ring-white/20 transition-all";
  const fieldLabel = "absolute left-3 -top-2.5 z-10 bg-[#353535] px-1.5 text-[10px] uppercase tracking-wider text-zinc-500";
  const fieldInput = "w-full h-11 min-h-11 border-0 bg-transparent px-3 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0";

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#353535]">
      <div className="flex items-center gap-2 px-8 py-4 text-sm">
        <Link href="/users" className="text-zinc-400 hover:text-zinc-200 transition-colors">
          Employees
        </Link>
        <ChevronRight size={16} className="text-zinc-600" />
        <span className="text-red-500">
          {form.firstName || form.lastName ? `${form.firstName} ${form.lastName}`.trim() : form.email}
        </span>
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
                <AvatarFallback className="bg-zinc-700 text-zinc-300 text-3xl font-bold">
                  {form.initials || (form.firstName?.[0] || "") + (form.lastName?.[0] || "")}
                </AvatarFallback>
              </Avatar>

              {isOwnProfile && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-zinc-200">
                    <Upload size={18} className="text-zinc-400" />
                    <span className="text-sm font-medium">Upload avatar image</span>
                  </div>
                  <p className="text-xs text-zinc-500">png, jpg or gif no more than 0.5MB</p>
                </div>
              )}
            </div>

            <div className="text-center space-y-1">
              <h1 className="text-xl font-semibold text-zinc-100">
                {form.firstName || form.lastName ? `${form.firstName} ${form.lastName}`.trim() : "Unnamed User"}
              </h1>
              <p className="text-sm text-zinc-400">{form.email}</p>
              {employee.memberSince && (
                <p className="text-xs text-white-600">A member since {employee.memberSince}</p>
              )}
            </div>

            <fieldset disabled={!isOwnProfile} className="grid grid-cols-2 gap-4 pt-4 disabled:opacity-60 disabled:cursor-not-allowed">
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
                  value={form.department}
                  onValueChange={(v) => set("department", v)}
                  disabled={!isOwnProfile}
                >
                  <SelectTrigger className={fieldInput}>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#353535] border-white/10 text-zinc-200">
                    {DEPARTMENTS.map((d) => (
                      <SelectItem key={d} value={d} className="focus:bg-white/5">{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className={fieldWrapper}>
                <Label className={fieldLabel}>Position</Label>
                <Select
                  value={form.position}
                  onValueChange={(v) => set("position", v)}
                  disabled={!isOwnProfile}
                >
                  <SelectTrigger className={fieldInput}>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#353535] border-white/10 text-zinc-200">
                    {POSITIONS.map((p) => (
                      <SelectItem key={p} value={p} className="focus:bg-white/5">{p}</SelectItem>
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

      {activeTab === "skills" && (
        <div>TODO</div>
      )}

      {activeTab === "languages" && (
        <div>TODO</div>
      )}
    </div>
  );
}
