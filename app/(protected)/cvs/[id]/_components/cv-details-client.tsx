"use client";

import { useState, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { ChevronRight, Search, Plus, EllipsisVertical, X, Trash2, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { updateCVDetailsAction, addSkillAction, removeSkillAction, addProjectAction, updateProjectAction, removeProjectAction } from "../../actions";

type CVDetailsClientProps = {
  cv: {
    id: string;
    name: string;
    education?: string | null;
    description: string;
    created_at: string;
    user?: { id: string; email: string } | null;
    skills: Array<{ name: string; categoryId?: string | null; mastery: string }>;
    projects?: Array<{
      id: string;
      name: string;
      description: string;
      domain: string;
      start_date: string;
      end_date?: string | null;
      environment?: string[];
      responsibilities?: string[];
    }> | null;
  };
  currentUserId: string;
  currentUserRole: string;
  canEdit: boolean;
};

type TabType = "details" | "skills" | "projects" | "preview";

const detailsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  education: z.string().min(1, "Education is required"),
  description: z.string().min(1, "Description is required"),
});

type DetailsFormData = z.infer<typeof detailsSchema>;

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  domain: z.string().min(1, "Domain is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  environment: z.string().optional(),
  responsibilities: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export function CVDetailsClient({ cv, canEdit }: CVDetailsClientProps) {
  const t = useTranslations("CVs");
  const c = useTranslations("Common");
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement>(null);

  const projects = cv.projects ?? [];
  const skills = cv.skills ?? [];

  const [activeTab, setActiveTab] = useState<TabType>("details");
  const [isExporting, setIsExporting] = useState(false);
  const [selectedSkillNames, setSelectedSkillNames] = useState<Set<string>>(new Set());
  const [projectSearchQuery, setProjectSearchQuery] = useState("");

  const [isDetailsSaving, setIsDetailsSaving] = useState(false);
  const [isSkillsSaving, setIsSkillsSaving] = useState(false);
  const [isProjectsSaving, setIsProjectsSaving] = useState(false);

  const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategoryId, setNewSkillCategoryId] = useState("");
  const [newSkillMastery, setNewSkillMastery] = useState("Proficient");

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [deleteProjectModal, setDeleteProjectModal] = useState<{ isOpen: boolean; projectId: string; projectName: string }>({ isOpen: false, projectId: "", projectName: "" });
  const [projectMenuOpenId, setProjectMenuOpenId] = useState<string | null>(null);

  const { register: registerDetails, handleSubmit: handleDetailsSubmit, formState: { errors: detailsErrors } } = useForm<DetailsFormData>({
    resolver: zodResolver(detailsSchema),
    defaultValues: { name: cv.name, education: cv.education || "", description: cv.description },
  });

  const projectForm = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: { name: "", domain: "", startDate: "", endDate: "", description: "", environment: "", responsibilities: "" },
  });

  const tabs = [
    { id: "details" as TabType, label: t("details.tabs.details") },
    { id: "skills" as TabType, label: t("details.tabs.skills") },
    { id: "projects" as TabType, label: t("details.tabs.projects") },
    { id: "preview" as TabType, label: t("details.tabs.preview") },
  ];

  const filteredProjects = useMemo(() => {
    const q = projectSearchQuery.toLowerCase();
    return projects.filter(p => p.name.toLowerCase().includes(q) || p.domain.toLowerCase().includes(q));
  }, [projects, projectSearchQuery]);

  const onDetailsSubmit = async (data: DetailsFormData) => {
    if (!canEdit) return;
    setIsDetailsSaving(true);
    try {
      await updateCVDetailsAction(cv.id, data);
      router.refresh();
    } catch (err) {
      console.error("Details update failed:", err);
    } finally {
      setIsDetailsSaving(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim() || !canEdit) return;
    setIsSkillsSaving(true);
    try {
      await addSkillAction(cv.id, newSkillName.trim(), newSkillCategoryId || undefined, newSkillMastery);
      setNewSkillName("");
      setNewSkillCategoryId("");
      setIsAddSkillModalOpen(false);
      router.refresh();
    } catch (err) {
      console.error("Skill add failed:", err);
    } finally {
      setIsSkillsSaving(false);
    }
  };

  const handleRemoveSkills = async () => {
    if (!canEdit || selectedSkillNames.size === 0) return;
    setIsSkillsSaving(true);
    try {
      await Promise.all(Array.from(selectedSkillNames).map(name => removeSkillAction(cv.id, name)));
      setSelectedSkillNames(new Set());
      router.refresh();
    } catch (err) {
      console.error("Skills remove failed:", err);
    } finally {
      setIsSkillsSaving(false);
    }
  };

  const handleProjectSubmit = async (data: ProjectFormData) => {
    if (!canEdit) return;
    setIsProjectsSaving(true);
    try {
      const env = data.environment ? data.environment.split(",").map(s => s.trim()).filter(Boolean) : [];
      const resp = data.responsibilities ? data.responsibilities.split("\n").map(s => s.trim()).filter(Boolean) : [];
      
      if (editingProjectId) {
        await updateProjectAction(editingProjectId, { ...data, environment: env, responsibilities: resp });
      } else {
        await addProjectAction(cv.id, { ...data, environment: env, responsibilities: resp });
      }
      setIsProjectModalOpen(false);
      setEditingProjectId(null);
      projectForm.reset();
      router.refresh();
    } catch (err) {
      console.error("Project save failed:", err);
    } finally {
      setIsProjectsSaving(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!deleteProjectModal.projectId) return;
    setIsProjectsSaving(true);
    try {
      await removeProjectAction(deleteProjectModal.projectId);
      setDeleteProjectModal({ isOpen: false, projectId: "", projectName: "" });
      router.refresh();
    } catch (err) {
      console.error("Project delete failed:", err);
    } finally {
      setIsProjectsSaving(false);
    }
  };

  const exportToPDF = async () => {
    if (!previewRef.current || !canEdit) return;
    setIsExporting(true);
    try {
      const originalTab = activeTab;
      setActiveTab("preview");
      await new Promise(r => setTimeout(r, 200));
      const dataUrl = await toPng(previewRef.current, { backgroundColor: "#353535", pixelRatio: 2 });
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const img = new Image();
      img.src = dataUrl;
      await new Promise(r => { img.onload = r; });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (img.height * pdfWidth) / img.width;
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${cv.name.replace(/\s+/g, "_")}_CV.pdf`);
      setActiveTab(originalTab);
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const toggleSkill = (name: string) => {
    if (!canEdit) return;
    setSelectedSkillNames(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const openProjectModal = (projectId?: string) => {
    if (projectId) {
      const p = projects.find(x => x.id === projectId);
      if (p) {
        setEditingProjectId(p.id);
        projectForm.reset({
          name: p.name,
          domain: p.domain,
          startDate: p.start_date,
          endDate: p.end_date || "",
          description: p.description,
          environment: (p.environment ?? []).join(", "),
          responsibilities: (p.responsibilities ?? []).join("\n"),
        });
      }
    } else {
      setEditingProjectId(null);
      projectForm.reset();
    }
    setIsProjectModalOpen(true);
    setProjectMenuOpenId(null);
  };

  const fieldWrapper = "relative rounded-lg border border-white/15 bg-[#353535] focus-within:border-white/30 focus-within:ring-1 focus-within:ring-white/20 transition-all";
  const fieldLabel = "absolute left-3 -top-2.5 z-10 bg-[#353535] px-1.5 text-[10px] uppercase tracking-wider text-zinc-500";
  const fieldInput = "w-full h-11 min-h-11 border-0 bg-transparent px-3 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0";

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#353535]">
      <div className="px-8 pt-6 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Link href="/cvs" className="hover:text-zinc-200 transition-colors">{t("details.breadcrumb.cvs")}</Link>
          <ChevronRight size={16} className="text-zinc-600" />
          <span className="text-zinc-100">{cv.name}</span>
        </div>
        <Button onClick={exportToPDF} disabled={isExporting || !canEdit} className="h-10 px-4 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded-4xl uppercase text-xs tracking-widest border border-white/10">
          <Download size={16} className="mr-2" />
          {isExporting ? t("details.export.exporting") : t("details.export.button")}
        </Button>
      </div>

      <div className="px-8 pb-4 border-b border-white/10">
        <div className="flex gap-6">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn("pb-3 px-1 text-xs uppercase tracking-wider font-medium transition-colors relative", activeTab === tab.id ? "text-red-400" : "text-zinc-500 hover:text-zinc-300")}>
              {tab.label}
              {activeTab === tab.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-400" />}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-8 pb-8">
        {activeTab === "details" && (
          <form onSubmit={handleDetailsSubmit(onDetailsSubmit)} className="max-w-3xl space-y-6">
            <div className={fieldWrapper}>
              <Label className={fieldLabel}>{t("details.detailsTab.fields.name")}</Label>
              <Input {...registerDetails("name")} className={fieldInput} disabled={!canEdit} />
              {detailsErrors.name && <p className="text-xs text-red-400 mt-1 px-1">{detailsErrors.name.message}</p>}
            </div>
            <div className={fieldWrapper}>
              <Label className={fieldLabel}>{t("details.detailsTab.fields.education")}</Label>
              <Input {...registerDetails("education")} className={fieldInput} disabled={!canEdit} />
              {detailsErrors.education && <p className="text-xs text-red-400 mt-1 px-1">{detailsErrors.education.message}</p>}
            </div>
            <div className={fieldWrapper}>
              <Label className={fieldLabel}>{t("details.detailsTab.fields.description")}</Label>
              <textarea {...registerDetails("description")} rows={6} className={cn(fieldInput, "resize-none h-auto pt-3 pb-2 min-h-[120px]")} disabled={!canEdit} />
              {detailsErrors.description && <p className="text-xs text-red-400 mt-1 px-1">{detailsErrors.description.message}</p>}
            </div>
            {canEdit && (
              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={isDetailsSaving} className="bg-zinc-700 hover:bg-zinc-600 text-zinc-100 border border-white/10 rounded-4xl uppercase text-xs tracking-widest">
                  {isDetailsSaving ? t("details.detailsTab.updating") : t("details.detailsTab.updateButton")}
                </Button>
              </div>
            )}
          </form>
        )}

        {activeTab === "skills" && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              {skills.map(skill => (
                <div key={skill.name} onClick={() => toggleSkill(skill.name)} className={cn("flex items-center gap-2 px-3 py-2 rounded-lg border transition-all", selectedSkillNames.has(skill.name) ? "border-red-400/50 bg-red-400/10 text-red-300" : "border-white/10 bg-[#2a2a2a] text-zinc-300", canEdit ? "cursor-pointer hover:border-white/20" : "cursor-default")}>
                  <span>{skill.name}</span>
                  <span className="text-xs opacity-70">({skill.mastery})</span>
                </div>
              ))}
              {skills.length === 0 && <p className="text-zinc-500 text-sm">{t("details.skillsTab.noSkills") || "No skills yet"}</p>}
            </div>
            {canEdit && (
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <Button onClick={() => setIsAddSkillModalOpen(true)} className="bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded-4xl uppercase text-xs tracking-widest">
                  <Plus size={16} className="mr-2" /> {t("details.skillsTab.addSkill")}
                </Button>
                <Button onClick={handleRemoveSkills} disabled={selectedSkillNames.size === 0 || isSkillsSaving} variant="outline" className="border-red-400/30 text-red-400 hover:bg-red-400/10 rounded-4xl uppercase text-xs tracking-widest">
                  <Trash2 size={16} className="mr-2" /> {c("actions.delete")}
                </Button>
                {isSkillsSaving && <span className="text-zinc-500 text-xs self-center">{c("actions.saving")}</span>}
              </div>
            )}
          </div>
        )}

        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-xs">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <Input value={projectSearchQuery} onChange={e => setProjectSearchQuery(e.target.value)} placeholder={t("details.projectsTab.searchPlaceholder")} className="pl-9 h-10 bg-[#2a2a2a] border-white/10 text-zinc-200 rounded-4xl" />
              </div>
              {canEdit && (
                <Button onClick={() => openProjectModal()} className="h-10 px-4 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded-4xl uppercase text-xs tracking-widest border border-white/10">
                  <Plus size={16} className="mr-2" /> {t("details.projectsTab.addProject")}
                </Button>
              )}
            </div>

            <div className="grid grid-cols-[2fr_1.5fr_1fr_auto] gap-4 px-4 py-3 border-b border-white/10 text-xs uppercase tracking-wider text-zinc-500">
              <div className="flex items-center gap-1">{t("details.projectsTab.tableHeaders.name")}</div>
              <div className="flex items-center gap-1">{t("details.projectsTab.tableHeaders.domain")}</div>
              <div className="flex items-center gap-1">{t("details.projectsTab.tableHeaders.startDate")}</div>
              <div className="w-10" />
            </div>

            <div className="divide-y divide-white/10">
              {filteredProjects.map(proj => (
                <div key={proj.id} className="py-5 px-4 hover:bg-white/2 transition-colors">
                  <div className="grid grid-cols-[2fr_1.5fr_1fr_auto] gap-4 items-start">
                    <h3 className="text-sm font-medium text-zinc-100 truncate">{proj.name}</h3>
                    <p className="text-sm text-zinc-400 truncate">{proj.domain}</p>
                    <p className="text-sm text-zinc-400">{proj.start_date} – {proj.end_date || t("details.projectsTab.present") || "Present"}</p>
                    <div className="relative">
                      <button onClick={() => setProjectMenuOpenId(projectMenuOpenId === proj.id ? null : proj.id)} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
                        <EllipsisVertical size={16} className="text-zinc-400" />
                      </button>
                      {projectMenuOpenId === proj.id && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setProjectMenuOpenId(null)} />
                          <div className="absolute right-0 top-8 z-50 min-w-32 bg-[#353535] rounded-lg shadow-xl border border-white/10 py-1">
                            {canEdit && <button onClick={() => openProjectModal(proj.id)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-200 hover:bg-white/5">{c("actions.update")}</button>}
                            {canEdit && <button onClick={() => { setDeleteProjectModal({ isOpen: true, projectId: proj.id, projectName: proj.name }); setProjectMenuOpenId(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-white/5">{c("actions.delete")}</button>}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-500 line-clamp-2 max-w-4xl">{proj.description}</p>
                </div>
              ))}
              {filteredProjects.length === 0 && <p className="py-8 text-center text-zinc-500 text-sm">{t("details.projectsTab.noProjects") || "No projects found"}</p>}
            </div>
          </div>
        )}

        {activeTab === "preview" && (
          <div ref={previewRef} className="p-8 rounded-xl bg-[#2a2a2a] text-zinc-200 max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl font-bold text-zinc-100">{cv.name}</h1>
            <div className="grid grid-cols-3 gap-6 text-sm">
              <div><h3 className="font-semibold uppercase text-zinc-400 mb-2">{t("details.previewTab.education")}</h3><p className="text-zinc-300">{cv.education || "—"}</p></div>
              <div><h3 className="font-semibold uppercase text-zinc-400 mb-2">{t("details.previewTab.skills")}</h3><p className="text-zinc-300">{skills.map(s => `${s.name} (${s.mastery})`).join(", ") || "—"}</p></div>
              <div><h3 className="font-semibold uppercase text-zinc-400 mb-2">{t("details.previewTab.projects")}</h3><p className="text-zinc-300">{projects.map(p => p.name).join(", ") || "—"}</p></div>
            </div>
            <div><h3 className="font-semibold uppercase text-zinc-400 mb-2">{t("details.previewTab.description") || "Description"}</h3><p className="text-zinc-300 leading-relaxed">{cv.description}</p></div>
          </div>
        )}
      </div>

      {isAddSkillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md bg-[#353535] rounded-xl shadow-2xl border border-white/10 p-6 mx-4">
            <h2 className="text-lg font-semibold text-zinc-100 mb-4">{t("details.skillsTab.addSkillModal.title")}</h2>
            <form onSubmit={handleAddSkill} className="space-y-4">
              <div className={fieldWrapper}>
                <Label className={fieldLabel}>{t("details.skillsTab.addSkillModal.skillName")}</Label>
                <Input value={newSkillName} onChange={e => setNewSkillName(e.target.value)} className={fieldInput} autoFocus />
              </div>
              <div className={fieldWrapper}>
                <Label className={fieldLabel}>{t("details.skillsTab.addSkillModal.category")}</Label>
                <Input value={newSkillCategoryId} onChange={e => setNewSkillCategoryId(e.target.value)} className={fieldInput} placeholder="Optional" />
              </div>
              <div className={fieldWrapper}>
                <Label className={fieldLabel}>{t("details.skillsTab.addSkillModal.proficiency")}</Label>
                <Select value={newSkillMastery} onValueChange={setNewSkillMastery}>
                  <SelectTrigger className={fieldInput}><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#353535] border-white/10 text-zinc-200">
                    {["Novice", "Advanced", "Competent", "Proficient", "Expert"].map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" onClick={() => setIsAddSkillModalOpen(false)} className="border-white/10 text-zinc-300 hover:bg-white/5">{c("actions.cancel")}</Button>
                <Button type="submit" disabled={!newSkillName.trim() || isSkillsSaving} className="bg-zinc-700 hover:bg-zinc-600 text-zinc-100">{isSkillsSaving ? c("actions.saving") : c("actions.create")}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Dialog open={isProjectModalOpen} onOpenChange={open => { if (!open) { setIsProjectModalOpen(false); setEditingProjectId(null); } }}>
        <DialogContent className="bg-[#353535] border-white/10 text-zinc-200 sm:max-w-lg">
          <DialogHeader><DialogTitle>{editingProjectId ? t("details.projectsTab.projectModal.editTitle") : t("details.projectsTab.projectModal.addTitle")}</DialogTitle></DialogHeader>
          <form onSubmit={projectForm.handleSubmit(handleProjectSubmit)} className="space-y-4 mt-4">
            <div className={fieldWrapper}><Label className={fieldLabel}>{t("details.projectsTab.projectModal.fields.project")}</Label><Input {...projectForm.register("name")} className={fieldInput} /></div>
            <div className={fieldWrapper}><Label className={fieldLabel}>{t("details.projectsTab.projectModal.fields.domain")}</Label><Input {...projectForm.register("domain")} className={fieldInput} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className={fieldWrapper}><Label className={fieldLabel}>{t("details.projectsTab.projectModal.fields.startDate")}</Label><Input type="date" {...projectForm.register("startDate")} className={fieldInput} /></div>
              <div className={fieldWrapper}><Label className={fieldLabel}>{t("details.projectsTab.projectModal.fields.endDate")}</Label><Input type="date" {...projectForm.register("endDate")} className={fieldInput} /></div>
            </div>
            <div className={fieldWrapper}><Label className={fieldLabel}>{t("details.projectsTab.projectModal.fields.description")}</Label><textarea {...projectForm.register("description")} rows={3} className={cn(fieldInput, "resize-none h-auto pt-3 pb-2 min-h-[80px]")} /></div>
            <div className={fieldWrapper}><Label className={fieldLabel}>{t("details.projectsTab.projectModal.fields.environment")}</Label><Input {...projectForm.register("environment")} placeholder={t("details.projectsTab.projectModal.placeholders.environment")} className={fieldInput} /></div>
            <div className={fieldWrapper}><Label className={fieldLabel}>{t("details.projectsTab.projectModal.fields.responsibilities")}</Label><textarea {...projectForm.register("responsibilities")} rows={3} className={cn(fieldInput, "resize-none h-auto pt-3 pb-2 min-h-[80px]")} placeholder={t("details.projectsTab.projectModal.placeholders.responsibilities")} /></div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => { setIsProjectModalOpen(false); setEditingProjectId(null); }} className="border-white/10 text-zinc-300 hover:bg-white/5">{c("actions.cancel")}</Button>
              <Button type="submit" disabled={isProjectsSaving} className="bg-zinc-700 hover:bg-zinc-600 text-zinc-100">{isProjectsSaving ? c("actions.saving") : (editingProjectId ? c("actions.update") : c("actions.create"))}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {deleteProjectModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md bg-[#353535] rounded-xl shadow-2xl border border-white/10 p-6 mx-4">
            <h2 className="text-lg font-semibold text-zinc-100 mb-2">{t("details.projectsTab.deleteModal.title")}</h2>
            <p className="text-sm text-zinc-400 mb-6">{t("details.projectsTab.deleteModal.message", { name: deleteProjectModal.projectName })}</p>
            <div className="flex justify-end gap-3">
              <Button onClick={() => setDeleteProjectModal({ isOpen: false, projectId: "", projectName: "" })} disabled={isProjectsSaving} className="border-white/10 text-zinc-300 hover:bg-white/5">{c("actions.cancel")}</Button>
              <Button onClick={handleDeleteProject} disabled={isProjectsSaving} className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30">{isProjectsSaving ? c("actions.saving") : c("actions.delete")}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
