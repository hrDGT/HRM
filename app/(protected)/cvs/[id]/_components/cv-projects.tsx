"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Search, Plus, EllipsisVertical, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { removeProjectAction } from "../../actions";
import { ProjectsModal, type ProjectItem } from "./projects-modal";

type CVProjectsProps = {
  cv: {
    id: string;
    projects?: Array<{
      id: string;        // Project entity id — used as identifier for update/remove
      name: string;
      description: string;
      domain: string;
      start_date: string;
      end_date?: string | null;
      environment?: string[];
      roles?: string[];
      responsibilities?: string[];
    }> | null;
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
  const [projectMenuOpenId, setProjectMenuOpenId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

  const filteredProjects = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return projects
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.domain.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        const aVal = (sortField === "end_date" ? a.end_date : a[sortField]) ?? "";
        const bVal = (sortField === "end_date" ? b.end_date : b[sortField]) ?? "";
        const cmp = String(aVal).localeCompare(String(bVal));
        return sortAsc ? cmp : -cmp;
      });
  }, [projects, searchQuery, sortField, sortAsc]);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortAsc((p) => !p);
    else { setSortField(field); setSortAsc(true); }
  };

  const SortIcon = ({ field }: { field: SortField }) =>
    sortField === field
      ? sortAsc
        ? <ArrowUp size={14} className="ml-1 text-zinc-400" />
        : <ArrowDown size={14} className="ml-1 text-zinc-400" />
      : null;

  const openAdd = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const openEdit = (proj: (typeof projects)[number]) => {
    setEditingProject(proj);
    setIsModalOpen(true);
    setProjectMenuOpenId(null);
  };

  const handleRemove = async (projectId: string) => {
    await removeProjectAction(projectId, cv.id);
    setProjectMenuOpenId(null);
    router.refresh();
  };

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("details.projectsTab.searchPlaceholder")}
            className="pl-8 h-9 border-white/10 rounded-4xl text-sm text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:border-white/20"
          />
        </div>
        {canEdit && (
          <Button
            onClick={openAdd}
            className="h-9 px-3 text-xs font-semibold tracking-wider bg-transparent border-0 shadow-none text-red-500 hover:text-red-400 whitespace-nowrap"
          >
            <Plus size={14} className="mr-1.5" />
            {t("details.projectsTab.addProject")}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-4 px-4 py-3 border-b border-white/10 text-xs uppercase tracking-widermb-0text-zinc-500 mb-0">
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

      <div className="divide-y divide-white/10 overflow-hidden">
        {filteredProjects.length === 0 ? (
          <p className="py-12 text-center text-zinc-500 text-sm">
            {t("details.projectsTab.noProjects") || "No projects found"}
          </p>
        ) : (
          filteredProjects.map((proj) => (
            <div key={proj.id} className="group py-6 px-4 hover:bg-white/2 transition-colors">
              <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-4 items-start">
                <h3 className="text-sm font-medium text-zinc-100 truncate pr-2">{proj.name}</h3>
                <p className="text-sm text-zinc-400 truncate pr-2">{proj.domain}</p>
                <p className="text-sm text-zinc-400 truncate">{proj.start_date}</p>
                <p className="text-sm text-zinc-400 truncate">
                  {proj.end_date || t("details.projectsTab.tillNow")}
                </p>

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
                          <button
                            onClick={() => openEdit(proj)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-200 hover:bg-white/5"
                          >
                            {c("actions.update")}
                          </button>
                        )}
                        {canEdit && (
                          <button
                            onClick={() => handleRemove(proj.id)}
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
              <p className="mt-3 text-sm leading-relaxed text-zinc-500 line-clamp-2 max-w-4xl">
                {proj.description}
              </p>
            </div>
          ))
        )}
      </div>

      <ProjectsModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cvId={cv.id}
        initialProject={editingProject}
        onSuccess={() => router.refresh()}
      />
    </div>
  );
}
