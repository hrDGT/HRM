"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  getProficiencyColor,
  type ProficiencyLevel,
} from "@/lib/users/language-utils";
import { cn } from "@/lib/utils";

import {
  addProfileLanguage,
  deleteProfileLanguages,
  getAvailableLanguages,
  getUserLanguages,
  updateProfileLanguage,
} from "../actions";

import { LanguageModal } from "./language-modal";

export type LanguageEntry = {
  name: string;
  proficiency: ProficiencyLevel;
};

type UserLanguagesProps = {
  userId: number;
  canEdit: boolean;
};

type ModalState =
  | { type: "closed" }
  | { type: "add" }
  | { type: "update"; languageName: string; proficiency: ProficiencyLevel };

export function UserLanguages({ userId, canEdit }: UserLanguagesProps) {
  const t = useTranslations("Users");
  const [languages, setLanguages] = useState<LanguageEntry[]>([]);
  const [availableLanguages, setAvailableLanguages] = useState<
    { id: string; name: string }[]
  >([]);
  const [selectedLanguages, setSelectedLanguages] = useState<Set<string>>(
    new Set(),
  );
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>({ type: "closed" });

  const loadLanguages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [userLanguages, allLanguages] = await Promise.all([
        getUserLanguages(userId),
        getAvailableLanguages(),
      ]);

      setLanguages(userLanguages);
      setAvailableLanguages(allLanguages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load languages");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLanguages();
  }, [userId]);

  const handleLanguageClick = (language: LanguageEntry) => {
    if (!canEdit) return;
    if (isSelectionMode) {
      setSelectedLanguages((prev) => {
        const next = new Set(prev);
        next.has(language.name)
          ? next.delete(language.name)
          : next.add(language.name);
        return next;
      });
      return;
    }
    setModal({
      type: "update",
      languageName: language.name,
      proficiency: language.proficiency,
    });
  };

  const handleToggleDeleteMode = () => {
    if (isSelectionMode && selectedLanguages.size === 0) {
      setIsSelectionMode(false);
    } else {
      setIsSelectionMode(true);
    }
  };

  const handleAddLanguage = () => setModal({ type: "add" });

  const handleConfirmAdd = async (
    languageName: string,
    proficiency: ProficiencyLevel,
  ) => {
    await addProfileLanguage(userId, languageName, proficiency);
    await loadLanguages();
  };

  const handleConfirmUpdate = async (
    languageName: string,
    proficiency: ProficiencyLevel,
  ) => {
    await updateProfileLanguage(userId, languageName, proficiency);
    await loadLanguages();
  };

  const handleRemoveLanguages = async () => {
    if (selectedLanguages.size === 0) return;
    setIsSaving(true);
    setError(null);
    try {
      await deleteProfileLanguages(userId, Array.from(selectedLanguages));
      setLanguages((prev) =>
        prev.filter((l) => !selectedLanguages.has(l.name)),
      );
      setSelectedLanguages(new Set());
      setIsSelectionMode(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to remove languages",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelSelection = () => {
    setSelectedLanguages(new Set());
    setIsSelectionMode(false);
  };

  if (isLoading) {
    return (
      <div className="px-8 pb-8 flex items-center justify-center min-h-50">
        <Loader2 className="w-6 h-6 text-main-text animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="px-8 pb-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
            {languages.map((language) => {
              const color = getProficiencyColor(language.proficiency);
              const isSelected = selectedLanguages.has(language.name);
              return (
                <div
                  key={language.name}
                  onClick={() => handleLanguageClick(language)}
                  className={cn(
                    "relative flex items-center gap-3 py-2 px-4 hover:bg-active-sidebar-bg rounded-4xl",
                    canEdit && "cursor-pointer",
                  )}
                >
                  <span
                    className={cn(
                      "text-sm font-semibold px-2.5 py-1 rounded shrink-0",
                      isSelected ? "text-white" : "text-zinc-300",
                    )}
                    style={{
                      color: isSelected ? "#fff" : color,
                    }}
                  >
                    {language.proficiency}
                  </span>

                  <span
                    className={cn(
                      "text-base whitespace-nowrap transition-colors",
                      isSelected ? "text-main-text" : "text-secondary-text",
                    )}
                  >
                    {language.name}
                  </span>
                </div>
              );
            })}
          </div>

          {languages.length === 0 && !isLoading && (
            <div className="text-center py-12 text-secondary-text">
              <p className="text-sm">{t("noLanguages")}</p>
              {canEdit && (
                <Button
                  onClick={handleAddLanguage}
                  variant="ghost"
                  className="mt-2 text-sm text-red-500 hover:text-red-400 hover:bg-transparent"
                >
                  <Plus size={14} className="mr-1" />
                  {t("addFirstLanguage")}
                </Button>
              )}
            </div>
          )}

          {canEdit && (
            <div className="flex justify-end gap-3 pt-6">
              {!isSelectionMode && (
                <Button
                  onClick={handleAddLanguage}
                  variant="outline"
                  disabled={isSaving}
                  className="h-10 px-5 text-sm font-semibold tracking-wider uppercase transition-all border-none bg-transparent text-secondary-text hover:text-zinc-200 hover:bg-modal-cancel-btn rounded-full"
                >
                  <Plus size={14} className="mr-2" />
                  {t("addLanguage")}
                </Button>
              )}

              {isSelectionMode && selectedLanguages.size > 0 && (
                <Button
                  onClick={handleCancelSelection}
                  variant="outline"
                  disabled={isSaving}
                  className="h-10 px-5 text-sm font-semibold tracking-wider uppercase transition-all border-none bg-transparent text-secondary-text hover:text-zinc-200 hover:bg-modal-cancel-btn rounded-full"
                >
                  {t("cancelSelection")}
                </Button>
              )}

              <Button
                onClick={
                  isSelectionMode && selectedLanguages.size > 0
                    ? handleRemoveLanguages
                    : handleToggleDeleteMode
                }
                disabled={isSaving}
                variant="outline"
                className={cn(
                  "h-10 px-5 text-sm text-primary font-semibold tracking-wider uppercase border-none transition-all gap-2 rounded-full hover:bg-hover-action-create-btn",
                  isSelectionMode &&
                    selectedLanguages.size > 0 &&
                    "bg-red-500 text-white hover:bg-red-600",
                )}
              >
                {isSaving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  (!isSelectionMode || selectedLanguages.size === 0) && (
                    <Trash2 size={14} />
                  )
                )}
                {t("removeSelected")}
                {isSelectionMode && selectedLanguages.size > 0 && !isSaving && (
                  <span className="w-5 h-5 rounded-full bg-white text-zinc-900 text-[10px] font-bold flex items-center justify-center">
                    {selectedLanguages.size}
                  </span>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      <LanguageModal
        open={modal.type === "add"}
        onClose={() => setModal({ type: "closed" })}
        mode="add"
        availableLanguages={availableLanguages}
        onConfirm={handleConfirmAdd}
      />

      {modal.type === "update" && (
        <LanguageModal
          open
          onClose={() => setModal({ type: "closed" })}
          mode="update"
          availableLanguages={availableLanguages}
          initialLanguageName={modal.languageName}
          initialProficiency={modal.proficiency}
          onConfirm={handleConfirmUpdate}
        />
      )}
    </>
  );
}
