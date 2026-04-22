"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { addProjectAction, updateProjectAction, getAvailableProjects } from "../../actions";
import type { AvailableProject } from "../../actions";

export type ProjectItem = {
  id: string;
  name: string;
  domain: string;
  start_date: string;
  end_date?: string | null;
  description: string;
  environment?: string[];
  roles?: string[];
  responsibilities?: string[];
};

type ProjectsModalProps = {
  open: boolean;
  onClose: () => void;
  cvId: string;
  initialProject: ProjectItem | null;
  onSuccess: () => void;
};

export function ProjectsModal({ open, onClose, cvId, initialProject, onSuccess }: ProjectsModalProps) {
  const t = useTranslations("CVs");
  const c = useTranslations("Common");

  const [isSaving, setIsSaving] = useState(false);
  const [allProjects, setAllProjects] = useState<AvailableProject[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  const [selectedProject, setSelectedProject] = useState<AvailableProject | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const comboboxRef = useRef<HTMLDivElement>(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [dateError, setDateError] = useState<string | null>(null);

  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsLoadingProjects(true);
    getAvailableProjects()
      .then(setAllProjects)
      .catch(console.error)
      .finally(() => setIsLoadingProjects(false));
  }, []);

  useEffect(() => {
    if (!open) return;
    setDateError(null);
    setIsDropdownOpen(false);
    
    if (initialProject) {
      const match = allProjects.find((p) => p.id === initialProject.id) ?? null;
      
      setSelectedProject(match);
      setInputValue(initialProject.name);
      
      setStartDate(initialProject.start_date);
      setEndDate(initialProject.end_date ?? "");
      setResponsibilities((initialProject.responsibilities ?? []).join("\n"));
    } else {
      setSelectedProject(null);
      setInputValue("");
      setStartDate("");
      setEndDate("");
      setResponsibilities("");
    }
  }, [open, initialProject, allProjects]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
        if (selectedProject) setInputValue(selectedProject.name);
        else if (initialProject) setInputValue(initialProject.name);
        else setInputValue("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [selectedProject, initialProject]);

  const filteredProjects = useMemo(() => {
    const q = inputValue.toLowerCase();
    if (!q || selectedProject?.name.toLowerCase() === q) return allProjects;
    return allProjects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.internal_name.toLowerCase().includes(q) ||
        p.domain.toLowerCase().includes(q)
    );
  }, [allProjects, inputValue, selectedProject]);

  const handleSelect = (p: AvailableProject) => {
    setSelectedProject(p);
    setInputValue(p.name);
    setIsDropdownOpen(false);
  };

  const handleClear = () => {
    setSelectedProject(null);
    setInputValue("");
    setIsDropdownOpen(false);
  };

  const handleInputChange = (val: string) => {
    setInputValue(val);
    if (selectedProject && val !== selectedProject.name) setSelectedProject(null);
    setIsDropdownOpen(true);
  };

  const validateDates = (start: string, end: string): boolean => {
    if (end && start && end <= start) {
      setDateError(
        t("details.projectsTab.projectModal.errors.endDateBeforeStart") ||
          "End date must be after start date"
      );
      return false;
    }
    setDateError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject && !initialProject) return;
    if (!startDate) return;
    if (!validateDates(startDate, endDate)) return;
    
    setIsSaving(true);
    try {
      const resp = responsibilities.split("\n").map((s) => s.trim()).filter(Boolean);
      const payload = {
        start_date: startDate,
        end_date: endDate || undefined,
        roles: [] as string[],
        responsibilities: resp,
      };
      
      const targetProjectId = initialProject?.id ?? selectedProject?.id;
      if (!targetProjectId) throw new Error("Project ID is required");
      
      if (initialProject) {
        await updateProjectAction(cvId, targetProjectId, payload);
      } else {
        await addProjectAction(cvId, { projectId: targetProjectId, ...payload });
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Project save failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const wrap = (error = false) =>
    cn(
      "relative rounded border transition-colors bg-[#2c2c2c] focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500/20",
      error ? "border-red-500/60" : "border-white/15"
    );

  const lbl = (error = false) =>
    cn(
      "absolute -top-2 left-3 px-1 text-[10px] uppercase tracking-wider bg-[#2c2c2c] pointer-events-none select-none transition-colors",
      error ? "text-red-400" : "text-zinc-500",
      "group-focus-within:text-red-500" 
    );

  const inp = "w-full bg-transparent border-0 outline-none text-sm text-zinc-200 placeholder:text-zinc-600 focus:ring-0 px-3 h-12";
  
  const hideNativePicker = " [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer";

  if (!open) return null;

  const displayProject = selectedProject ?? initialProject;
  const filled = !!displayProject;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl bg-[#2c2c2c] rounded-xl shadow-2xl border border-white/10 flex flex-col max-h-[90vh]">

        <div className="flex items-center justify-between px-6 pt-5 pb-4 shrink-0">
          <h2 className="text-base font-semibold text-zinc-100">
            {initialProject
              ? t("details.projectsTab.projectModal.editTitle")
              : t("details.projectsTab.projectModal.addTitle")}
          </h2>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-white/8 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">

          <div className="grid grid-cols-2 gap-4">

            {/* Project Combobox */}
            <div ref={comboboxRef} className="relative group">
              <div className={wrap()}>
                <label className={lbl()}>
                  {t("details.projectsTab.projectModal.fields.project")}
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder={isLoadingProjects ? (c("loading") || "Loading…") : ""}
                    className={cn(inp, "flex-1 pr-0")}
                    autoComplete="off"
                  />
                  <div className="flex items-center gap-0 pr-2 shrink-0">
                    {inputValue && (
                      <button type="button" onClick={handleClear} className="p-1.5 text-zinc-500 hover:text-zinc-300">
                        <X size={14} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen((v) => !v)}
                      className="p-1.5 text-zinc-500 hover:text-zinc-300"
                    >
                      <ChevronDown size={16} className={cn("transition-transform", isDropdownOpen && "rotate-180")} />
                    </button>
                  </div>
                </div>
              </div>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 z-50 mt-0.5 bg-[#252525] border border-white/10 rounded-lg shadow-2xl overflow-hidden">
                  <div className="max-h-52 overflow-y-auto">
                    {filteredProjects.length === 0 ? (
                      <p className="py-4 text-center text-xs text-zinc-500">
                        {t("details.projectsTab.noProjects") || "No projects found"}
                      </p>
                    ) : (
                      filteredProjects.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleSelect(p)}
                          className={cn(
                            "w-full flex flex-col items-start gap-0.5 px-4 py-2.5 text-left hover:bg-white/5 transition-colors",
                            selectedProject?.id === p.id && "bg-white/5"
                          )}
                        >
                          <span className="text-sm text-zinc-200 truncate w-full">{p.name}</span>
                          <span className="text-xs text-zinc-500">{p.domain}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Domain (read-only) — ✅ FIX: используем displayProject */}
            <div className={wrap()}>
              <label className={lbl()}>
                {t("details.projectsTab.projectModal.fields.domain")}
              </label>
              <div className={cn(inp, "flex items-center", filled ? "text-zinc-300" : "text-zinc-600")}>
                {filled ? displayProject!.domain : ""}
              </div>
            </div>
          </div>

          {/* Date inputs with custom calendar icon only */}
          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div className={cn(wrap(!!dateError && !!startDate), "group")}>
              <label className={lbl(!!dateError && !!startDate)}>
                {t("details.projectsTab.projectModal.fields.startDate")}
              </label>
              <div className="flex items-center h-12">
                <input
                  ref={startDateRef}
                  type="date"
                  value={startDate}
                  onChange={(e) => { 
                    setStartDate(e.target.value); 
                    if (endDate) validateDates(e.target.value, endDate); 
                    else setDateError(null); 
                  }}
                  className={cn(inp, "[color-scheme:dark]", hideNativePicker)}
                />
                <button
                  type="button"
                  onClick={() => startDateRef.current?.showPicker?.()}
                  className="px-3 text-zinc-500 hover:text-red-500 transition-colors"
                  aria-label="Select start date"
                >
                  <Calendar size={16} />
                </button>
              </div>
            </div>

            {/* End Date */}
            <div className={cn(wrap(!!dateError && !!endDate), "group")}>
              <label className={lbl(!!dateError && !!endDate)}>
                {t("details.projectsTab.projectModal.fields.endDate")}
              </label>
              <div className="flex items-center h-12">
                <input
                  ref={endDateRef}
                  type="date"
                  value={endDate}
                  onChange={(e) => { 
                    setEndDate(e.target.value); 
                    validateDates(startDate, e.target.value); 
                  }}
                  className={cn(inp, "[color-scheme:dark]", hideNativePicker)}
                />
                <button
                  type="button"
                  onClick={() => endDateRef.current?.showPicker?.()}
                  className="px-3 text-zinc-500 hover:text-red-500 transition-colors"
                  aria-label="Select end date"
                >
                  <Calendar size={16} />
                </button>
              </div>
            </div>
          </div>
          {dateError && <p className="text-xs text-red-400 -mt-2">{dateError}</p>}

          {/* Description (read-only) — ✅ FIX: используем displayProject */}
          <div className={wrap()}>
            <label className={lbl()}>
              {t("details.projectsTab.projectModal.fields.description")}
            </label>
            <div
              className={cn(
                "px-3 pt-5 pb-3 min-h-[100px] text-sm leading-relaxed",
                filled ? "text-zinc-300" : "text-zinc-600"
              )}
            >
              {filled ? displayProject!.description : ""}
            </div>
          </div>

          {/* Environment (read-only tags) — ✅ FIX: используем displayProject */}
          <div className={wrap()}>
            <label className={lbl()}>
              {t("details.projectsTab.projectModal.fields.environment")}
            </label>
            <div className="px-3 py-3 min-h-[52px] flex flex-wrap gap-1.5 items-center">
              {filled && displayProject!.environment && displayProject!.environment.length > 0 ? (
                displayProject!.environment.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/8 text-xs text-zinc-300 border border-white/10"
                  >
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-sm text-zinc-600" />
              )}
            </div>
          </div>

          {/* Responsibilities (editable) */}
          <div className={wrap()}>
            <label className={lbl()}>
              {t("details.projectsTab.projectModal.fields.responsibilities")}
            </label>
            <textarea
              value={responsibilities}
              onChange={(e) => setResponsibilities(e.target.value)}
              rows={4}
              placeholder={
                t("details.projectsTab.projectModal.placeholders.responsibilities") ||
                "One responsibility per line…"
              }
              className="w-full bg-transparent border-0 outline-none text-sm text-zinc-200 placeholder:text-zinc-600 focus:ring-0 px-3 pt-5 pb-3 min-h-[100px] h-auto resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-full border-white/15 text-zinc-300 hover:bg-white/5 px-6"
            >
              {c("actions.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isSaving || (!selectedProject && !initialProject) || !startDate || !!dateError}
              className="rounded-full bg-red-500 hover:bg-red-400 text-white px-8 font-semibold tracking-wide disabled:opacity-40 disabled:bg-red-500"
            >
              {isSaving
                ? c("actions.saving")
                : initialProject
                  ? c("actions.update").toUpperCase()
                  : c("actions.create").toUpperCase()}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
