"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Search, Plus, EllipsisVertical, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { updateProjectAction, addProjectAction, removeProjectAction } from "../../actions";

type CVProjectsProps = {
  cv: {
    id: string;
    projects?: Array<{
      id: string;
      name: string;
      description: string;
      domain: string;
      start_date: string;
      end_date?: string | null;
      environment?: string[];
      responsibilities?: string[] }> | null
    };
  canEdit: boolean;
};

type SortField = "name" | "domain" | "start_date" | "end_date";

export function CVProjects({ cv, canEdit }: CVProjectsProps) {
  const t = useTranslations("CVs");
  const c = useTranslations("Common");
  const router = useRouter();
  const projects = cv.projects ?? [];
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("start_date");
  const [sortAsc, setSortAsc] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectMenuOpenId, setProjectMenuOpenId] = useState<string | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", domain: "", startDate: "", endDate: "", description: "", environment: "", responsibilities: "" });

  const filteredProjects = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return projects
      .filter(p => p.name.toLowerCase().includes(q) || p.domain.toLowerCase().includes(q))
      .sort((a, b) => {
        let aVal: string;
        let bVal: string;
        if (sortField === "start_date") {
          aVal = a.start_date ?? "";
          bVal = b.start_date ?? "";
        } else if (sortField === "end_date") {
          aVal = a.end_date ?? "";
          bVal = b.end_date ?? "";
        } else {
          aVal = a[sortField] ?? "";
          bVal = b[sortField] ?? "";
        }
        const cmp = aVal.localeCompare(bVal);
        return sortAsc ? cmp : -cmp;
      });
  }, [projects, searchQuery, sortField, sortAsc]);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortAsc(p => !p);
    else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const SortIcon = ({ field }: { field: SortField }) =>
    sortField === field ? (
      sortAsc ? <ArrowUp size={14} className="ml-1 text-zinc-400" /> : <ArrowDown size={14} className="ml-1 text-zinc-400" />
    ) : null;

  const openProjectModal = (projectId?: string) => {
    if (projectId) {
      const p = projects.find(x => x.id === projectId);
      if (p) {
        setEditingProjectId(p.id);
        setFormData({
          name: p.name, domain: p.domain, startDate: p.start_date,
          endDate: p.end_date || "", description: p.description,
          environment: (p.environment ?? []).join(", "),
          responsibilities: (p.responsibilities ?? []).join("\n")
        });
      }
    } else {
      setEditingProjectId(null);
      setFormData({ name: "", domain: "", startDate: "", endDate: "", description: "", environment: "", responsibilities: "" });
    }
    setIsProjectModalOpen(true);
    setProjectMenuOpenId(null);
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.domain || !formData.startDate || !formData.description) return;
    setIsSaving(true);
    try {
      const env = formData.environment ? formData.environment.split(",").map(s => s.trim()).filter(Boolean) : [];
      const resp = formData.responsibilities ? formData.responsibilities.split("\n").map(s => s.trim()).filter(Boolean) : [];
      const payload = { ...formData, environment: env, responsibilities: resp, endDate: formData.endDate || undefined };
      if (editingProjectId) {
        await updateProjectAction(editingProjectId, payload);
      } else {
        await addProjectAction(cv.id, payload);
      }
      setIsProjectModalOpen(false);
      router.refresh();
    } catch (err) {
      console.error("Project save failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const fieldWrapper = "relative rounded-lg border border-white/15 bg-[#353535] focus-within:border-white/30 focus-within:ring-1 focus-within:ring-white/20 transition-all";
  const fieldLabel = "absolute left-3 -top-2.5 z-10 bg-[#353535] px-1.5 text-[10px] uppercase tracking-wider text-zinc-500";
  const fieldInput = "w-full h-11 min-h-11 border-0 bg-transparent px-3 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t("details.projectsTab.searchPlaceholder")}
            className="pl-8 h-9 border-white/10 rounded-4xl text-sm text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:border-white/20"
          />
        </div>
        {canEdit && (
          <Button
            onClick={() => openProjectModal()}
            className="h-9 px-3 text-xs font-semibold tracking-wider bg-transparent border-0 shadow-none text-red-500 hover:text-red-400 whitespace-nowrap"
          >
            <Plus size={14} className="mr-1.5" />
            {t("details.projectsTab.addProject")}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-4 px-4 py-3 border-b border-white/10 text-xs uppercase tracking-wider text-zinc-500">
        <div className="flex items-center gap-1 cursor-pointer hover:text-zinc-300" onClick={() => handleSort("name")}>
          {t("details.projectsTab.tableHeaders.name")} <SortIcon field="name" />
        </div>
        <div className="flex items-center gap-1 cursor-pointer hover:text-zinc-300" onClick={() => handleSort("domain")}>
          {t("details.projectsTab.tableHeaders.domain")} <SortIcon field="domain" />
        </div>
        <div className="flex items-center gap-1 cursor-pointer hover:text-zinc-300" onClick={() => handleSort("start_date")}>
          {t("details.projectsTab.tableHeaders.startDate")} <SortIcon field="start_date" />
        </div>
        <div className="flex items-center gap-1 cursor-pointer hover:text-zinc-300" onClick={() => handleSort("end_date")}>
          {t("details.projectsTab.tableHeaders.endDate")} <SortIcon field="end_date" />
        </div>
        <div className="w-10" />
      </div>

      <div className="divide-y divide-white/10">
        {filteredProjects.length === 0 ? (
          <p className="py-12 text-center text-zinc-500 text-sm">{t("details.projectsTab.noProjects") || "No projects found"}</p>
        ) : (
          filteredProjects.map(proj => (
            <div key={proj.id} className="group py-6 px-4 hover:bg-white/2 transition-[background-color]">
              <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-4 items-start">
                <h3 className="text-sm font-medium text-zinc-100 truncate pr-2">{proj.name}</h3>
                <p className="text-sm text-zinc-400 truncate pr-2">{proj.domain}</p>
                <p className="text-sm text-zinc-400 truncate">{proj.start_date}</p>
                <p className="text-sm text-zinc-400 truncate">{proj.end_date}</p>
                <div className="relative">
                  <button
                    onClick={() => setProjectMenuOpenId(projectMenuOpenId === proj.id ? null : proj.id)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <EllipsisVertical size={16} className="text-zinc-400" />
                  </button>
                  {projectMenuOpenId === proj.id && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setProjectMenuOpenId(null)} />
                      <div className="absolute right-0 top-8 z-50 min-w-32 bg-[#353535] rounded-lg shadow-xl border border-white/10 py-1">
                        {canEdit && (
                          <button onClick={() => openProjectModal(proj.id)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-200 hover:bg-white/5">
                            {c("actions.update")}
                          </button>
                        )}
                        {canEdit && (
                          <button
                            onClick={async () => { await removeProjectAction(proj.id); router.refresh(); setProjectMenuOpenId(null); }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-white/5"
                          >
                            {c("actions.delete")}
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500 line-clamp-2 max-w-4xl">{proj.description}</p>
            </div>
          ))
        )}
      </div>

      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-lg bg-[#353535] rounded-xl shadow-2xl border border-white/10 p-6 mx-4">
            <h2 className="text-lg font-semibold text-zinc-100 mb-4">
              {editingProjectId ? t("details.projectsTab.projectModal.editTitle") : t("details.projectsTab.projectModal.addTitle")}
            </h2>
            <form onSubmit={handleProjectSubmit} className="space-y-4">
              <div className={fieldWrapper}><Label className={fieldLabel}>{t("details.projectsTab.projectModal.fields.project")}</Label><Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={fieldInput} /></div>
              <div className={fieldWrapper}><Label className={fieldLabel}>{t("details.projectsTab.projectModal.fields.domain")}</Label><Input value={formData.domain} onChange={e => setFormData({...formData, domain: e.target.value})} className={fieldInput} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className={fieldWrapper}><Label className={fieldLabel}>{t("details.projectsTab.projectModal.fields.startDate")}</Label><Input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className={fieldInput} /></div>
                <div className={fieldWrapper}><Label className={fieldLabel}>{t("details.projectsTab.projectModal.fields.endDate")}</Label><Input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className={fieldInput} /></div>
              </div>
              <div className={fieldWrapper}><Label className={fieldLabel}>{t("details.projectsTab.projectModal.fields.description")}</Label><textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className={cn(fieldInput, "resize-none h-auto pt-3 pb-2 min-h-[80px]")} /></div>
              <div className={fieldWrapper}><Label className={fieldLabel}>{t("details.projectsTab.projectModal.fields.environment")}</Label><Input value={formData.environment} onChange={e => setFormData({...formData, environment: e.target.value})} placeholder={t("details.projectsTab.projectModal.placeholders.environment")} className={fieldInput} /></div>
              <div className={fieldWrapper}><Label className={fieldLabel}>{t("details.projectsTab.projectModal.fields.responsibilities")}</Label><textarea value={formData.responsibilities} onChange={e => setFormData({...formData, responsibilities: e.target.value})} rows={3} className={cn(fieldInput, "resize-none h-auto pt-3 pb-2 min-h-[80px]")} placeholder={t("details.projectsTab.projectModal.placeholders.responsibilities")} /></div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsProjectModalOpen(false)} className="border-white/10 text-zinc-300 hover:bg-white/5">{c("actions.cancel")}</Button>
                <Button type="submit" disabled={isSaving} className="bg-zinc-700 hover:bg-zinc-600 text-zinc-100">{isSaving ? c("actions.saving") : (editingProjectId ? c("actions.update") : c("actions.create"))}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
