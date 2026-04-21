"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModalWrapper } from "@/components/ui/modal-wrapper";
import { cn } from "@/lib/utils";
import { CVFormData } from "./create-cv-modal";

const cvSchema = z.object({
  name: z.string().min(1, "Name is required"),
  education: z.string().min(1, "Education is required"),
  description: z.string().min(1, "Description is required"),
});

type CVItem = {
  id: string;
  name: string;
  education: string;
  description: string;
};

type UpdateCVModalProps = {
  open: boolean;
  onClose: () => void;
  cv: CVItem | null;
  onUpdate: (data: CVFormData & { id: string }) => void;
  isPending: boolean;
};

export function UpdateCVModal({ open, onClose, cv, onUpdate, isPending }: UpdateCVModalProps) {
  const c = useTranslations("Common");
  const t = useTranslations("CVs");

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<CVFormData>({
    resolver: zodResolver(cvSchema),
    defaultValues: { name: "", education: "", description: "" },
  });

  useEffect(() => {
    if (open && cv) {
      reset({ name: cv.name, education: cv.education, description: cv.description });
    }
  }, [open, cv, reset]);

  const onSubmit = async (data: CVFormData) => {
    if (!cv) return;
    await onUpdate({ ...data, id: cv.id });
    reset();
  };

  const fieldWrapper = "group relative rounded-lg border border-white/15 bg-[#2c2c2c] focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500/20 transition-all duration-300";
  const fieldLabel = "absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:-top-2.5 group-focus-within:translate-y-0 bg-[#2c2c2c] px-1.5 text-xs text-red-500 pointer-events-none select-none opacity-0 group-focus-within:opacity-100 transition-all duration-300 ease-in-out";
  const fieldInput = "w-full h-11 min-h-11 border-0 bg-transparent px-3 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:transition-opacity duration-300 focus-within:placeholder:opacity-0";

  return (
    <ModalWrapper open={open} onClose={onClose} title={t("dialog.editTitle")}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className={fieldWrapper}>
          <Label className={fieldLabel}>{t("fields.name")}</Label>
          <Input {...register("name")} className={fieldInput} placeholder={t("fields.name")} />
          {errors.name && <p className="text-xs text-red-400 mt-1 px-1">{errors.name.message}</p>}
        </div>
        <div className={fieldWrapper}>
          <Label className={fieldLabel}>{t("fields.education")}</Label>
          <Input {...register("education")} className={fieldInput} placeholder={t("fields.education")} />
          {errors.education && <p className="text-xs text-red-400 mt-1 px-1">{errors.education.message}</p>}
        </div>
        <div className={fieldWrapper}>
          <Label className={fieldLabel}>{t("fields.description")}</Label>
          <textarea {...register("description")} rows={4} className={cn(fieldInput, "resize-none h-auto pt-3 pb-2 min-h-[80px]")} placeholder={t("fields.description")} />
          {errors.description && <p className="text-xs text-red-400 mt-1 px-1">{errors.description.message}</p>}
        </div>

        <div className="flex justify-end w-full mt-6 pt-4 border-white/10">
          <div className="w-1/2 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 uppercase text-xs tracking-widest text-zinc-400 hover:text-zinc-200 bg-transparent hover:bg-white/5 border-white/10 rounded-4xl"
            >
              {c("actions.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={!isDirty || isPending}
              className={cn(
                "flex-1 uppercase text-xs tracking-widest rounded-4xl transition-all duration-300",
                !isDirty || isPending
                  ? "bg-zinc-600 text-zinc-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 text-zinc-100 cursor-pointer"
              )}
            >
              {isPending ? c("actions.saving") : c("actions.update")}
            </Button>
          </div>
        </div>
      </form>
    </ModalWrapper>
  );
}
