"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getMasteryVisuals, type MasteryLevel } from "@/lib/users/skill-utils";
import {
  getCVSkills,
  deleteCVSkills,
  addCVSkill,
  updateCVSkill,
  getAvailableSkills,
} from "../../actions";
import { SkillModal } from "./skill-modal";

export type SkillEntry = {
  name: string;
  categoryId?: string | null;
  categoryName?: string | null;
  categoryParentName?: string | null;
  mastery: MasteryLevel;
};

export type SkillCategory = {
  id?: string | null;
  name?: string | null;
  parentName?: string | null;
  skills: SkillEntry[];
};

type CVSkillsProps = {
  cvId: string;
  canEdit: boolean;
};

type ModalState =
  | { type: "closed" }
  | { type: "add" }
  | { type: "update"; skillName: string; mastery: MasteryLevel };

export function CVSkills({ cvId, canEdit }: CVSkillsProps) {
  const t = useTranslations("CVs");
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [availableSkills, setAvailableSkills] = useState<{ id: string; name: string }[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>({ type: "closed" });

  const loadSkills = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [skills, allSkills] = await Promise.all([
        getCVSkills(cvId),
        getAvailableSkills(),
      ]);

      const grouped = skills.reduce((acc: SkillCategory[], skill: SkillEntry) => {
        const key = skill.categoryId ?? "uncategorized";
        const existing = acc.find((c) => c.id === key);
        if (existing) {
          existing.skills.push(skill);
        } else {
          acc.push({
            id: key === "uncategorized" ? null : key,
            name: skill.categoryName ?? null,
            parentName: skill.categoryParentName ?? null,
            skills: [skill],
          });
        }
        return acc;
      }, []);

      setCategories(grouped);
      setAvailableSkills(allSkills);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load skills");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, [cvId]);

  const handleSkillClick = (skill: SkillEntry) => {
    if (!canEdit) return;
    if (isSelectionMode) {
      setSelectedSkills((prev) => {
        const next = new Set(prev);
        next.has(skill.name) ? next.delete(skill.name) : next.add(skill.name);
        return next;
      });
      return;
    }
    setModal({ type: "update", skillName: skill.name, mastery: skill.mastery });
  };

  const handleToggleDeleteMode = () => {
    if (isSelectionMode && selectedSkills.size === 0) {
      setIsSelectionMode(false);
    } else {
      setIsSelectionMode(true);
    }
  };

  const handleAddSkill = () => setModal({ type: "add" });

  const handleConfirmAdd = async (skillName: string, mastery: MasteryLevel) => {
    await addCVSkill(cvId, skillName, mastery);
    await loadSkills();
  };

  const handleConfirmUpdate = async (skillName: string, mastery: MasteryLevel) => {
    await updateCVSkill(cvId, skillName, mastery);
    await loadSkills();
  };

  const handleRemoveSkills = async () => {
    if (selectedSkills.size === 0) return;
    setIsSaving(true);
    setError(null);
    try {
      await deleteCVSkills(cvId, Array.from(selectedSkills));
      setCategories((prev) =>
        prev
          .map((cat) => ({
            ...cat,
            skills: cat.skills.filter((s) => !selectedSkills.has(s.name)),
          }))
          .filter((cat) => cat.skills.length > 0)
      );
      setSelectedSkills(new Set());
      setIsSelectionMode(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove skills");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelSelection = () => {
    setSelectedSkills(new Set());
    setIsSelectionMode(false);
  };

  if (isLoading) {
    return (
      <div className="px-8 pb-8 flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="px-8 pb-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-8">
            {categories.map((category) => (
              <div key={category.id || "uncategorized"} className="space-y-4">
                <h3 className="text-sm font-medium text-zinc-200">
                  {/* ✅ Теперь показываем categoryName вместо ID */}
                  {category.name || t("uncategorized")}
                  {category.parentName && (
                    <span className="ml-2 text-xs text-zinc-500">— {category.parentName}</span>
                  )}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
                  {category.skills.map((skill) => {
                    const { progress, color, dimColor } = getMasteryVisuals(skill.mastery);
                    const isSelected = selectedSkills.has(skill.name);
                    return (
                      <div
                        key={skill.name}
                        onClick={() => handleSkillClick(skill)}
                        className={cn(
                          "relative flex items-center gap-3 py-1",
                          canEdit && "cursor-pointer"
                        )}
                      >
                        <div
                          className="relative w-20 h-1 flex-shrink-0"
                          style={{ backgroundColor: isSelected ? "#3a3a3a" : dimColor }}
                        >
                          <div
                            className="absolute inset-y-0 left-0 transition-all"
                            style={{
                              width: `${progress}%`,
                              backgroundColor: isSelected ? "#3a3a3a" : color,
                            }}
                          />
                        </div>
                        <span
                          className={cn(
                            "text-xs whitespace-nowrap transition-colors",
                            isSelected ? "text-white" : "text-zinc-400"
                          )}
                        >
                          {skill.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {categories.length === 0 && !isLoading && (
              <div className="text-center py-12 text-zinc-500">
                <p className="text-sm">{t("noSkills")}</p>
                {canEdit && (
                  <Button
                    onClick={handleAddSkill}
                    variant="ghost"
                    className="mt-2 text-xs text-red-500 hover:text-red-400 hover:bg-transparent"
                  >
                    <Plus size={14} className="mr-1" />
                    {t("addFirstSkill")}
                  </Button>
                )}
              </div>
            )}
          </div>

          {canEdit && (
            <div className="flex justify-end gap-3 pt-6">
              {!isSelectionMode && (
                <Button
                  onClick={handleAddSkill}
                  variant="outline"
                  disabled={isSaving}
                  className="h-10 px-5 text-sm font-semibold tracking-wider uppercase transition-all border-none bg-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/5 rounded-full"
                >
                  <Plus size={14} className="mr-2" />
                  {t("addSkill")}
                </Button>
              )}

              {isSelectionMode && selectedSkills.size > 0 && (
                <Button
                  onClick={handleCancelSelection}
                  variant="outline"
                  disabled={isSaving}
                  className="h-10 px-5 text-sm font-semibold tracking-wider uppercase transition-all border-zinc-400/20 rounded-full bg-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                >
                  {t("cancelSelection")}
                </Button>
              )}

              <Button
                onClick={isSelectionMode && selectedSkills.size > 0 ? handleRemoveSkills : handleToggleDeleteMode}
                disabled={isSaving}
                variant="outline"
                className={cn(
                  "h-10 px-5 text-sm font-semibold tracking-wider uppercase border-none transition-all gap-2 rounded-full",
                  isSelectionMode && selectedSkills.size > 0
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : isSelectionMode
                      ? "bg-transparent text-red-500/60 hover:text-red-400"
                      : "bg-transparent text-zinc-400 hover:text-red-400 hover:bg-transparent"
                )}
              >
                {isSaving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  (!isSelectionMode || selectedSkills.size === 0) && <Trash2 size={14} />
                )}
                {t("removeSelected")}
                {isSelectionMode && selectedSkills.size > 0 && !isSaving && (
                  <span className="w-5 h-5 rounded-full bg-white text-zinc-900 text-[10px] font-bold flex items-center justify-center">
                    {selectedSkills.size}
                  </span>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      <SkillModal
        open={modal.type === "add"}
        onClose={() => setModal({ type: "closed" })}
        mode="add"
        availableSkills={availableSkills}
        onConfirm={handleConfirmAdd}
      />

      {modal.type === "update" && (
        <SkillModal
          open
          onClose={() => setModal({ type: "closed" })}
          mode="update"
          availableSkills={availableSkills}
          initialSkillName={modal.skillName}
          initialMastery={modal.mastery}
          onConfirm={handleConfirmUpdate}
        />
      )}
    </>
  );
}
