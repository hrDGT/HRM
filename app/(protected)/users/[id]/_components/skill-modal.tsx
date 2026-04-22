"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, Loader2 } from "lucide-react";

import { ModalWrapper } from "@/components/ui/modal-wrapper";
import { MASTERY_ORDER, type MasteryLevel } from "@/lib/users/skill-utils";
import { cn } from "@/lib/utils";

type AvailableSkill = {
  id: string;
  name: string;
};

type SkillModalProps = {
  open: boolean;
  onClose: () => void;
  mode: "add" | "update";
  availableSkills: AvailableSkill[];
  initialSkillName?: string;
  initialMastery?: MasteryLevel;
  onConfirm: (skillName: string, mastery: MasteryLevel) => Promise<void>;
};

export function SkillModal({
  open,
  onClose,
  mode,
  availableSkills,
  initialSkillName = "",
  initialMastery = "Novice",
  onConfirm,
}: SkillModalProps) {
  const t = useTranslations("Users");
  const [selectedSkill, setSelectedSkill] = useState(initialSkillName);
  const [selectedMastery, setSelectedMastery] =
    useState<MasteryLevel>(initialMastery);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      if (initialSkillName) setSelectedSkill(initialSkillName);
      else setSelectedSkill("");
      setSelectedMastery(initialMastery);
      setError(null);
    }
  }, [open, initialSkillName, initialMastery]);

  const handleConfirm = async () => {
    if (!selectedSkill) return;
    setIsLoading(true);
    setError(null);
    try {
      await onConfirm(selectedSkill, selectedMastery);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const canConfirm = !!selectedSkill && !isLoading;

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={
        mode === "add" ? t("skillModal.addTitle") : t("skillModal.updateTitle")
      }
    >
      {error && (
        <div className="mb-4 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-destructive text-xs">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <fieldset className="border border-main-border rounded-lg px-4 pt-1 pb-1 focus-visible:border-main-text hover:border-main-text transition-colors">
          <legend className="text-[11px] text-secondary-text px-1">
            {t("skillModal.skill")}
          </legend>
          <div className="relative">
            <select
              aria-label={t("skillModal.skill")}
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              disabled={mode === "update"}
              className={cn(
                "w-full bg-transparent text-base text-main-text appearance-none outline-none cursor-pointer py-1",
                mode === "update"
                  ? " cursor-not-allowed text-disabled-btn"
                  : "text",
              )}
            >
              {mode === "add" && (
                <option value="" disabled>
                  {t("skillModal.selectSkill")}
                </option>
              )}
              {availableSkills.map((s) => (
                <option
                  key={s.id}
                  value={s.name}
                  className="bg-main-bg text-main-text p-2 text-base focus-visible:border-main-text hover:bg-active-sidebar-bg cursor-pointer data-[state=checked]:bg-select-checked"
                >
                  {s.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 text-secondary-text pointer-events-none",
              )}
            />
          </div>
        </fieldset>

        <fieldset className="border border-main-border rounded-lg px-4 pt-1 pb-1 focus-visible:border-main-text hover:border-main-text transition-colors">
          <legend className="text-[11px] text-secondary-text px-1">
            {t("skillModal.mastery")}
          </legend>
          <div className="relative">
            <select
              aria-label={t("skillModal.mastery")}
              value={selectedMastery}
              onChange={(e) =>
                setSelectedMastery(e.target.value as MasteryLevel)
              }
              className="w-full bg-transparent text-base text-main-text appearance-none outline-none cursor-pointer py-1"
            >
              {MASTERY_ORDER.map((level) => (
                <option
                  key={level}
                  value={level}
                  className="bg-main-bg text-main-text p-2 text-base focus-visible:border-main-text hover:bg-active-sidebar-bg cursor-pointer data-[state=checked]:bg-select-checked"
                >
                  {level}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-secondary-text pointer-events-none"
            />
          </div>
        </fieldset>
      </div>

      <div className="mt-6">
        <div className="flex flex-col justify-center items-center w-full sm:flex-row sm:justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-full border min-w-50 transition-colors min-h-12 text-secondary-text rounded-4xl uppercase hover:bg-modal-cancel-btn cursor-pointer sm:w-auto border-border"
          >
            {t("skillModal.cancel")}
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className={cn(
              "uppercase min-w-50 transition-colors min-h-12 rounded-4xl max-h-10 border-transparent text-white shadow-btn w-full sm:w-auto cursor-pointer",
              canConfirm
                ? "bg-primary text-white  hover:bg-hover-action-submit-btn"
                : "disabled:text-disabled-btn disabled:border-transparent disabled:shadow-none cursor-not-allowed",
            )}
          >
            {isLoading && <Loader2 size={13} className="mr-2 animate-spin" />}
            {t("skillModal.confirm")}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}
