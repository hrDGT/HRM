"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Loader2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { PROFICIENCY_ORDER, type ProficiencyLevel } from "@/lib/users/language-utils";
import { ModalWrapper } from "@/components/ui/modal-wrapper";

type AvailableLanguage = {
  id: string;
  name: string;
};

type LanguageModalProps = {
  open: boolean;
  onClose: () => void;
  mode: "add" | "update";
  availableLanguages: AvailableLanguage[];
  initialLanguageName?: string;
  initialProficiency?: ProficiencyLevel;
  onConfirm: (languageName: string, proficiency: ProficiencyLevel) => Promise<void>;
};

export function LanguageModal({
  open,
  onClose,
  mode,
  availableLanguages,
  initialLanguageName = "",
  initialProficiency = "A1",
  onConfirm,
}: LanguageModalProps) {
  const t = useTranslations("Users");
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguageName);
  const [selectedProficiency, setSelectedProficiency] = useState<ProficiencyLevel>(initialProficiency);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setSelectedLanguage(initialLanguageName || availableLanguages[0]?.name || "");
      setSelectedProficiency(initialProficiency);
      setError(null);
    }
  }, [open, initialLanguageName, initialProficiency, availableLanguages]);

  const handleConfirm = async () => {
    if (!selectedLanguage) return;
    setIsLoading(true);
    setError(null);
    try {
      await onConfirm(selectedLanguage, selectedProficiency);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const canConfirm = !!selectedLanguage && !isLoading;

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={mode === "add" ? t("languageModal.addTitle") : t("languageModal.updateTitle")}
    >
      {error && (
        <div className="mb-4 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <fieldset className="border border-zinc-600 rounded-lg px-4 pt-1 pb-3">
          <legend className="text-[11px] text-zinc-500 px-1">{t("languageModal.language")}</legend>
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              disabled={mode === "update"}
              className={cn(
                "w-full bg-transparent text-sm appearance-none outline-none pr-6 py-1",
                mode === "update" ? "text-zinc-500 cursor-not-allowed" : "text-zinc-200"
              )}
            >
              {mode === "add" && (
                <option value="" disabled className="bg-[#2c2c2c]">{t("languageModal.selectLanguage")}</option>
              )}
              {availableLanguages.map((l) => (
                <option key={l.id} value={l.name} className="bg-[#2c2c2c] text-zinc-200">
                  {l.name}
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
          <legend className="text-[11px] text-zinc-500 px-1">{t("languageModal.proficiency")}</legend>
          <div className="relative">
            <select
              value={selectedProficiency}
              onChange={(e) => setSelectedProficiency(e.target.value as ProficiencyLevel)}
              className="w-full bg-transparent text-sm text-zinc-200 appearance-none outline-none pr-6 py-1"
            >
              {PROFICIENCY_ORDER.map((level) => (
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
          {t("languageModal.cancel")}
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
          {t("languageModal.confirm")}
        </button>
      </div>
    </ModalWrapper>
  );
}
