"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, Loader2 } from "lucide-react";

import { ModalWrapper } from "@/components/ui/modal-wrapper";
import {
  PROFICIENCY_ORDER,
  type ProficiencyLevel,
} from "@/lib/users/language-utils";
import { cn } from "@/lib/utils";

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
  onConfirm: (
    languageName: string,
    proficiency: ProficiencyLevel,
  ) => Promise<void>;
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
  const [selectedProficiency, setSelectedProficiency] =
    useState<ProficiencyLevel>(initialProficiency);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      const defaultValue =
        mode === "update"
          ? initialLanguageName || availableLanguages[0]?.name || ""
          : "";

      setSelectedLanguage(defaultValue);
      setSelectedProficiency(initialProficiency);
      setError(null);
    }
  }, [open, mode, initialLanguageName, initialProficiency, availableLanguages]);

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
      title={
        mode === "add"
          ? t("languageModal.addTitle")
          : t("languageModal.updateTitle")
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
            {t("languageModal.language")}
          </legend>
          <div className="relative">
            <select
              aria-label={t("languageModal.language")}
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              disabled={mode === "update"}
              className={cn(
                "w-full bg-transparent text-base text-main-text appearance-none outline-none cursor-pointer py-1",
                mode === "update"
                  ? " cursor-not-allowed text-disabled-btn"
                  : "text",
              )}
            >
              {mode === "add" && (
                <option
                  value=""
                  disabled
                  className="bg-main-bg text-main-text p-2 text-base focus-visible:border-main-text hover:bg-active-sidebar-bg cursor-pointer data-[state=checked]:bg-select-checked"
                >
                  {t("languageModal.selectLanguage")}
                </option>
              )}
              {availableLanguages.map((l) => (
                <option
                  key={l.id}
                  value={l.name}
                  className="bg-main-bg text-main-text p-2 text-base focus-visible:border-main-text hover:bg-active-sidebar-bg cursor-pointer data-[state=checked]:bg-select-checked"
                >
                  {l.name}
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
            {t("languageModal.proficiency")}
          </legend>
          <div className="relative">
            <select
              aria-label={t("languageModal.proficiency")}
              value={selectedProficiency}
              onChange={(e) =>
                setSelectedProficiency(e.target.value as ProficiencyLevel)
              }
              className="w-full bg-transparent text-base text-main-text appearance-none outline-none cursor-pointer py-1"
            >
              {PROFICIENCY_ORDER.map((level) => (
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
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 text-secondary-text pointer-events-none",
              )}
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
            {t("languageModal.cancel")}
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
            {t("languageModal.confirm")}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}
