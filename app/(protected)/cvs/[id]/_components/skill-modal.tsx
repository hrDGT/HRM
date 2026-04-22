"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Loader2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { MASTERY_ORDER, type MasteryLevel } from "@/lib/users/skill-utils";
import { ModalWrapper } from "@/components/ui/modal-wrapper";

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
  const t = useTranslations("CVs");
  const [selectedSkill, setSelectedSkill] = useState(initialSkillName);
  const [selectedMastery, setSelectedMastery] = useState<MasteryLevel>(initialMastery);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setSelectedSkill(initialSkillName || "");
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
      title={mode === "add" ? t("addSkill") : t("updateSkill")}
    >
      {error && (
        <div className="mb-4 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <fieldset className="border border-zinc-600 rounded-lg px-4 pt-1 pb-3">
          <legend className="text-[11px] text-zinc-500 px-1">{t("skillModal.skill")}</legend>
          <div className="relative">
            <select
              aria-label={t("skillModal.skill")}
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              disabled={mode === "update"}
              className={cn(
                "w-full bg-transparent text-sm appearance-none outline-none pr-6 py-1",
                mode === "update" ? "text-zinc-500 cursor-not-allowed" : "text-zinc-200"
              )}
            >
              {mode === "add" && (
                <option value="" disabled className="bg-[#2c2c2c]">{t("skillModal.selectSkill")}</option>
              )}
              {availableSkills.map((s) => (
                <option key={s.id} value={s.name} className="bg-[#2c2c2c] text-zinc-200">
                  {s.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none",
                mode === "update" ? "text-zinc-600" : "text-zinc-400"
              )}
            />
          </div>
        </fieldset>

        <fieldset className="border border-zinc-600 rounded-lg px-4 pt-1 pb-3">
          <legend className="text-[11px] text-zinc-500 px-1">{t("skillModal.mastery")}</legend>
          <div className="relative">
            <select
              aria-label={t("skillModal.mastery")}
              value={selectedMastery}
              onChange={(e) => setSelectedMastery(e.target.value as MasteryLevel)}
              className=" w-full bg-transparent text-sm text-zinc-200 appearance-none outline-none pr-6 py-1 "
            >
              {MASTERY_ORDER.map((level) => (
                <option key={level} value={level} className="bg-[#2c2c2c] text-zinc-200">
                  {level}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
            />
          </div>
        </fieldset>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="h-10 px-6 text-xs font-semibold tracking-wider uppercase rounded-full border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition-all cursor-pointer"
        >
          {t("skillModal.cancel")}
        </button>
        <button
          onClick={handleConfirm}
          disabled={!canConfirm}
          className={cn(
            "h-10 px-6 text-xs font-semibold tracking-wider uppercase rounded-full transition-all flex items-center cursor-pointer",
            canConfirm
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-zinc-700 text-zinc-500 cursor-not-allowed"
          )}
        >
          {isLoading && <Loader2 size={13} className="mr-2 animate-spin" />}
          {t("skillModal.confirm")}
        </button>
      </div>
    </ModalWrapper>
  );
}
