"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

import { CreateCVModal, CVFormData } from "@/app/(protected)/cvs/_components/create-cv-modal";
import { createCVAction } from "@/app/(protected)/cvs/actions";

type UserCVsProps = {
  userId: string;
  cvs: Array<{ id: string; name: string; created_at: string }>;
  canEdit: boolean;
};

export function UserCVs({ userId, cvs, canEdit }: UserCVsProps) {
  const t = useTranslations("Users");
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleCreate = async (data: CVFormData) => {
    await createCVAction(userId, data);
    router.refresh();
    setIsCreateOpen(false);
  };

  if (cvs.length === 0) {
    return (
      <>
        <div className="px-8 pb-8 flex flex-col items-center justify-center min-h-[300px] text-zinc-500">
          <FileText size={48} className="mb-4 opacity-30" />
          <p className="text-sm mb-4">{t("noResults") || "No CVs yet"}</p>
          {canEdit && (
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded-4xl text-xs uppercase tracking-widest border border-white/10"
            >
              <Plus size={14} /> Create First CV
            </Button>
          )}
        </div>

        <CreateCVModal
          open={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onCreate={handleCreate}
          isPending={false} 
        />
      </>
    );
  }

  return (
    <div className="px-8 pb-8">
      {canEdit && (
        <div className="flex justify-end mb-4">
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-3 py-2 h-9 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded-4xl text-xs uppercase tracking-widest border border-white/10"
          >
            <Plus size={14} /> Create CV
          </Button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cvs.map((cv) => (
          <button
            key={cv.id}
            onClick={() => router.push(`/cvs/${cv.id}`)}
            className="group flex flex-col p-4 rounded-lg border border-white/10 bg-[#2a2a2a] hover:bg-white/5 transition-colors text-left"
          >
            <div className="flex items-center gap-3 mb-2">
              <FileText size={16} className="text-zinc-400 group-hover:text-red-400 transition-colors" />
              <span className="font-medium text-zinc-200 truncate">{cv.name}</span>
            </div>
            <span className="text-xs text-zinc-500">Created: {new Date(cv.created_at).toLocaleDateString()}</span>
          </button>
        ))}
      </div>

      <CreateCVModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreate}
        isPending={false}
      />
    </div>
  );
}
