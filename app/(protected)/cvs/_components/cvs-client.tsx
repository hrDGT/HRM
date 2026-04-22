"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Search, EllipsisVertical, Plus, ArrowUp, ArrowDown, Pencil, Trash2, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { createCVAction, updateCVAction, deleteCVAction } from "../actions";
import { CreateCVModal, CVFormData } from "./create-cv-modal";
import { UpdateCVModal } from "./update-cv-modal";
import { DeleteCVModal } from "./delete-cv-modal";

type CVItem = {
  id: string;
  name: string;
  education: string;
  description: string;
  userEmail: string;
};

type CVsClientProps = {
  initialCVs: CVItem[];
  currentUserRole: string;
  currentUserEmail: string;
  currentUserId: string;
};

export function CVsClient({
  initialCVs,
  currentUserRole,
  currentUserEmail,
  currentUserId,
}: CVsClientProps) {
  const t = useTranslations("CVs");
  const c = useTranslations("Common");
  const router = useRouter();
  
  const [cvs, setCvs] = useState<CVItem[]>(initialCVs);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"name" | "education" | "userEmail">("name");
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

  useEffect(() => {
    setCvs(initialCVs);
  }, [initialCVs]);

  const isAdmin = currentUserRole?.toUpperCase() === "ADMIN";

  const visibleCVs = useMemo(
    () => (isAdmin ? cvs : cvs.filter((cv) => cv.userEmail === currentUserEmail)),
    [cvs, isAdmin, currentUserEmail]
  );

  const filteredCVs = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return visibleCVs
      .filter(
        (cv) =>
          cv.name.toLowerCase().includes(q) ||
          cv.education.toLowerCase().includes(q) ||
          cv.description.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        const cmp = aVal.localeCompare(bVal);
        return sortAsc ? cmp : -cmp;
      });
  }, [visibleCVs, searchQuery, sortField, sortAsc]);

  const handleCreate = async (data: CVFormData) => {
    setIsMutating(true);
    try {
      await createCVAction(currentUserId, data);
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
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="h-9 px-3 text-xs font-semibold tracking-wider bg-transparent border-0 shadow-none text-red-500 hover:text-red-400 whitespace-nowrap"
          >
            <Plus size={14} className="mr-1.5" />
            {t("createButton")}
          </Button>
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
          <div className="flex items-center gap-1 cursor-pointer hover:text-zinc-300" onClick={() => handleSort("userEmail")}>
            {t("employee")} <SortIcon field="userEmail" />
          </div>
          <div className="w-10" />
        </div>

        <div className="divide-y divide-white/10 overflow-hidden">
          {filteredCVs.length === 0 ? (
            <div className="py-12 text-center text-zinc-500">{t("emptyState")}</div>
          ) : (
            filteredCVs.map((cv) => {
              const canEdit = isAdmin || cv.userEmail === currentUserEmail;
              const canDelete = canEdit;

              return (
                <div
                  key={cv.id}
                  className="group py-6 px-4"
                >
                  <div className="grid grid-cols-[2fr_1.5fr_1.5fr_auto] gap-4 items-start">
                    <h3 className="text-sm font-medium text-zinc-100 truncate pr-2">{cv.name}</h3>
                    <p className="text-sm text-zinc-400 truncate pr-2">{cv.education}</p>
                    <p className="text-sm text-zinc-400 truncate">{cv.userEmail}</p>

                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === cv.id ? null : cv.id);
                        }}
                        className="h-8 w-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer"
                      >
                        <EllipsisVertical size={16} className="text-zinc-400" />
                      </button>
                      {openMenuId === cv.id && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                          <div className="absolute right-0 top-8 z-50 min-w-32 bg-[#353535] rounded-lg shadow-xl border border-white/10 py-1">
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
                            )}
                            {canDelete && (
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
              );
            })
          )}
        </div>
      </div>

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
    </div>
  );
}
