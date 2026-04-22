"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Search, EllipsisVertical, Plus, ArrowUp, ArrowDown, Pencil, Trash2, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { createCVAction, updateCVAction, deleteCVAction } from "@/app/(protected)/cvs/actions";
import { CreateCVModal, CVFormData } from "@/app/(protected)/cvs/_components/create-cv-modal";
import { UpdateCVModal } from "@/app/(protected)/cvs/_components/update-cv-modal";
import { DeleteCVModal } from "@/app/(protected)/cvs/_components/delete-cv-modal";

type CVItem = {
  id: string;
  name: string;
  education: string;
  description: string;
  created_at: string;
};

type UserCVsProps = {
  userId: string;
  cvs: CVItem[];
  canEdit: boolean;
};

export function UserCVs({ userId, cvs: initialCVs, canEdit }: UserCVsProps) {
  const t = useTranslations("CVs");
  const c = useTranslations("Common");
  const router = useRouter();
  
  const [cvs, setCvs] = useState<CVItem[]>(initialCVs);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"name" | "education" | "created_at">("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; cvId: string; cvName: string }>({
    isOpen: false,
    cvId: "",
    cvName: "",
  });
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [updatingCV, setUpdatingCV] = useState<CVItem | null>(null);

  const filteredCVs = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return cvs
      .filter(
        (cv) =>
          cv.name.toLowerCase().includes(q) ||
          cv.education.toLowerCase().includes(q) ||
          cv.description.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        let aVal = "";
        let bVal = "";
        
        if (sortField === "created_at") {
          aVal = new Date(a[sortField]).toISOString();
          bVal = new Date(b[sortField]).toISOString();
        } else {
          aVal = a[sortField];
          bVal = b[sortField];
        }
        
        const cmp = aVal.localeCompare(bVal);
        return sortAsc ? cmp : -cmp;
      });
  }, [cvs, searchQuery, sortField, sortAsc]);

  const handleCreate = async (data: CVFormData) => {
    setIsMutating(true);
    try {
      await createCVAction(userId, data);
      router.refresh();
      setIsCreateOpen(false);
    } catch (err) {
      console.error("CV mutation failed:", err);
    } finally {
      setIsMutating(false);
    }
  };

  const handleUpdate = async (data: CVFormData & { id: string }) => {
    setIsMutating(true);
    try {
      await updateCVAction({ id: data.id, name: data.name, education: data.education, description: data.description });
      
      setCvs((prev) =>
        prev.map((cv) =>
          cv.id === data.id
            ? { ...cv, name: data.name, education: data.education, description: data.description }
            : cv
        )
      );
      
      router.refresh();
      setUpdatingCV(null);
    } catch (err) {
      console.error("CV mutation failed:", err);
    } finally {
      setIsMutating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.cvId) return;
    setIsMutating(true);
    try {
      await deleteCVAction(deleteModal.cvId);
      setCvs((prev) => prev.filter((cv) => cv.id !== deleteModal.cvId));
      router.refresh();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsMutating(false);
    }
  };

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) setSortAsc((p) => !p);
    else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const SortIcon = ({ field }: { field: typeof sortField }) =>
    sortField === field ? (
      sortAsc ? (
        <ArrowUp size={14} className="ml-1 text-zinc-400" />
      ) : (
        <ArrowDown size={14} className="ml-1 text-zinc-400" />
      )
    ) : null;

  if (!canEdit && filteredCVs.length === 0) {
    return (
      <div className="flex-1 flex flex-col overflow-y-auto bg-[#353535]">
        <div className="py-12 text-center text-zinc-500">{t("emptyState")}</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#353535]">
      <div className="px-8 pt-5 pb-4 border-white/5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">
            {t("title")}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={c("placeholders.search")}
              className="pl-8 h-9 border-white/10 rounded-4xl text-sm text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:border-white/20"
            />
          </div>
          {canEdit && (
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="h-9 px-3 text-xs font-semibold tracking-wider bg-transparent border-0 shadow-none text-red-500 hover:text-red-400 whitespace-nowrap"
            >
              <Plus size={14} className="mr-1.5" />
              {t("createButton")}
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 px-8 pb-8">
        <div className="grid grid-cols-[2fr_1.5fr_1.5fr_auto] gap-4 px-4 py-3 border-b border-white/10 text-xs uppercase tracking-wider text-zinc-500">
          <div className="flex items-center gap-1 cursor-pointer hover:text-zinc-300" onClick={() => handleSort("name")}>
            {t("name")} <SortIcon field="name" />
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-zinc-300" onClick={() => handleSort("education")}>
            {t("education")} <SortIcon field="education" />
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-zinc-300" onClick={() => handleSort("created_at")}>
            Date <SortIcon field="created_at" />
          </div>
          <div className="w-10" />
        </div>

        <div className="divide-y divide-white/10 overflow-visible">
          {filteredCVs.length === 0 ? (
            <div className="py-12 text-center text-zinc-500">{t("emptyState")}</div>
          ) : (
            filteredCVs.map((cv) => (
              <div key={cv.id} className="group py-6 px-4">
                <div className="grid grid-cols-[2fr_1.5fr_1.5fr_auto] gap-4 items-start">
                  <h3 className="text-sm font-medium text-zinc-100 truncate pr-2">{cv.name}</h3>
                  <p className="text-sm text-zinc-400 truncate pr-2">{cv.education}</p>
                  <p className="text-sm text-zinc-400 truncate">
                    {new Date(cv.created_at).toLocaleDateString()}
                  </p>

                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === cv.id ? null : cv.id);
                      }}
                      className="h-8 w-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer hover:bg-white/10"
                    >
                      <EllipsisVertical size={16} className="text-zinc-400" />
                    </button>
                    
                    {openMenuId === cv.id && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                        <div className="fixed right-4 top-[--menu-top] z-[100] min-w-32 bg-[#353535] rounded-lg shadow-xl border border-white/10 py-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/cvs/${cv.id}`);
                              setOpenMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-200 hover:bg-white/5 cursor-pointer"
                          >
                            <FileText size={14} /> {t("actions.view")}
                          </button>
                          
                          {canEdit && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setUpdatingCV(cv);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-200 hover:bg-white/5 cursor-pointer"
                              >
                                <Pencil size={14} /> {t("actions.edit")}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteModal({ isOpen: true, cvId: cv.id, cvName: cv.name });
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-white/5 cursor-pointer"
                              >
                                <Trash2 size={14} /> {t("actions.delete")}
                              </button>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500 line-clamp-2 max-w-4xl">
                  {cv.description}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {canEdit && (
        <>
          <CreateCVModal
            open={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
            onCreate={handleCreate}
            isPending={isMutating}
          />

          <UpdateCVModal
            open={!!updatingCV}
            onClose={() => setUpdatingCV(null)}
            cv={updatingCV}
            onUpdate={handleUpdate}
            isPending={isMutating}
          />

          <DeleteCVModal
            open={deleteModal.isOpen}
            onClose={() => setDeleteModal({ isOpen: false, cvId: "", cvName: "" })}
            onDelete={handleDelete}
            isPending={isMutating}
            cvName={deleteModal.cvName}
          />
        </>
      )}
    </div>
  );
}
