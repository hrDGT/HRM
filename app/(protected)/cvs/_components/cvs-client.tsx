"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search, Plus, EllipsisVertical, X, ArrowUp, ArrowDown, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { createCVAction, updateCVAction, deleteCVAction } from "../actions";

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
};

const cvSchema = z.object({
  name: z.string().min(1, "Name is required"),
  education: z.string().min(1, "Education is required"),
  description: z.string().min(1, "Description is required"),
});

type CVFormData = z.infer<typeof cvSchema>;

export function CVsClient({
  initialCVs,
  currentUserRole,
  currentUserEmail,
}: CVsClientProps) {
  const t = useTranslations("CVs");
  const c = useTranslations("Common");
  const router = useRouter();
  const [cvs, setCvs] = useState<CVItem[]>(initialCVs);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"name" | "education" | "userEmail">("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isMutating, setIsMutating] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; cvId: string; cvName: string }>({
    isOpen: false,
    cvId: "",
    cvName: "",
  });
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const isAdmin = currentUserRole?.toUpperCase() === "ADMIN";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CVFormData>({
    resolver: zodResolver(cvSchema),
    defaultValues: { name: "", education: "", description: "" },
  });

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

  const onSubmit = async (data: CVFormData) => {
    setIsMutating(true);
    try {
      if (editingId) {
        await updateCVAction({ ...data, id: editingId });
      } else {
        await createCVAction(data);
      }
      reset();
      setEditingId(null);
      setDialogOpen(false);
      router.refresh();
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
      setDeleteModal({ isOpen: false, cvId: "", cvName: "" });
      router.refresh();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsMutating(false);
    }
  };

  const startEdit = (cv: CVItem) => {
    reset({ name: cv.name, education: cv.education, description: cv.description });
    setEditingId(cv.id);
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    reset({ name: "", education: "", description: "" });
    setEditingId(null);
    setDialogOpen(true);
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

  const fieldWrapper = "relative rounded-lg border border-white/15 bg-[#353535] focus-within:border-white/30 focus-within:ring-1 focus-within:ring-white/20 transition-all";
  const fieldLabel = "absolute left-3 -top-2.5 z-10 bg-[#353535] px-1.5 text-[10px] uppercase tracking-wider text-zinc-500";
  const fieldInput = "w-full h-11 min-h-11 border-0 bg-transparent px-3 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0";

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#353535]">
      <div className="px-8 pt-6 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-xl font-semibold text-zinc-100">{t("title")}</h1>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="pl-9 h-10 bg-[#2a2a2a] border-white/10 text-zinc-200 rounded-4xl"
            />
          </div>
          <Button
            onClick={openCreateDialog}
            className="h-10 px-4 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded-4xl uppercase text-xs tracking-widest border border-white/10"
          >
            <Plus size={16} className="mr-2" />
            {c("actions.create")}
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

        <div className="divide-y divide-white/10">
          {filteredCVs.length === 0 ? (
            <div className="py-12 text-center text-zinc-500">{t("emptyState")}</div>
          ) : (
            filteredCVs.map((cv) => {
              const canEdit = isAdmin || cv.userEmail === currentUserEmail;
              const canDelete = canEdit;

              return (
                <div key={cv.id} className="group py-6 px-4 hover:bg-white/2 transition-colors">
                  <div className="grid grid-cols-[2fr_1.5fr_1.5fr_auto] gap-4 items-start">
                    <h3 className="text-sm font-medium text-zinc-100 truncate pr-2">{cv.name}</h3>
                    <p className="text-sm text-zinc-400 truncate pr-2">{cv.education}</p>
                    <p className="text-sm text-zinc-400 truncate">{cv.userEmail}</p>

                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === cv.id ? null : cv.id)}
                        className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <EllipsisVertical size={16} className="text-zinc-400" />
                      </button>
                      {openMenuId === cv.id && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                          <div className="absolute right-0 top-8 z-50 min-w-32 bg-[#353535] rounded-lg shadow-xl border border-white/10 py-1">
                            {canEdit && (
                              <button
                                onClick={() => { startEdit(cv); setOpenMenuId(null); }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-200 hover:bg-white/5"
                              >
                                <Pencil size={14} /> {t("actions.edit")}
                              </button>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => {
                                  setDeleteModal({ isOpen: true, cvId: cv.id, cvName: cv.name });
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-white/5"
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

      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) { setEditingId(null); reset(); } }}>
        <DialogContent className="bg-[#353535] border-white/10 text-zinc-200 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? t("dialog.editTitle") : t("dialog.createTitle")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div className={fieldWrapper}>
              <Label className={fieldLabel}>{t("fields.name")}</Label>
              <Input {...register("name")} className={fieldInput} />
              {errors.name && <p className="text-xs text-red-400 mt-1 px-1">{errors.name.message}</p>}
            </div>
            <div className={fieldWrapper}>
              <Label className={fieldLabel}>{t("fields.education")}</Label>
              <Input {...register("education")} className={fieldInput} />
              {errors.education && <p className="text-xs text-red-400 mt-1 px-1">{errors.education.message}</p>}
            </div>
            <div className={fieldWrapper}>
              <Label className={fieldLabel}>{t("fields.description")}</Label>
              <textarea
                {...register("description")}
                rows={4}
                className={cn(fieldInput, "resize-none h-auto pt-3 pb-2 min-h-[80px]")}
              />
              {errors.description && <p className="text-xs text-red-400 mt-1 px-1">{errors.description.message}</p>}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => { setDialogOpen(false); setEditingId(null); reset(); }}
                className="border-white/10 text-zinc-300 hover:bg-white/5"
                disabled={isMutating}
              >
                {t("actions.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isMutating}
                className="bg-zinc-700 hover:bg-zinc-600 text-zinc-100 border border-white/10"
              >
                {isMutating ? t("actions.saving") : editingId ? t("actions.update") : t("actions.create")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md bg-[#353535] rounded-xl shadow-2xl border border-white/10 p-6 mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-zinc-100">{t("dialog.deleteTitle")}</h2>
              <button onClick={() => setDeleteModal({ isOpen: false, cvId: "", cvName: "" })} className="text-zinc-400 hover:text-zinc-200">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-zinc-400 mb-6">
              {t("dialog.deleteMessage", { name: deleteModal.cvName })}
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteModal({ isOpen: false, cvId: "", cvName: "" })}
                disabled={isMutating}
                className="border-white/10 text-zinc-300 hover:bg-white/5"
              >
                {t("actions.cancel")}
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isMutating}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
              >
                {isMutating ? t("actions.deleting") : t("actions.confirmDelete")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
