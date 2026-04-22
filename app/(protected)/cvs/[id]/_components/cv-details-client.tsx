"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { updateCVDetailsAction } from "../../actions";

const detailsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  education: z.string().min(1, "Education is required"),
  description: z.string().min(1, "Description is required"),
});

type DetailsFormData = z.infer<typeof detailsSchema>;

type CVDetailsProps = {
  cv: { id: string; name: string; education?: string | null; description: string };
  canEdit: boolean;
};

export function CVDetails({ cv, canEdit }: CVDetailsProps) {
  const t = useTranslations("CVs");
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<DetailsFormData>({
    resolver: zodResolver(detailsSchema),
    defaultValues: {
      name: cv.name,
      education: cv.education || "",
      description: cv.description,
    },
    mode: "onChange",
  });

  const onSubmit = async (data: DetailsFormData) => {
    if (!canEdit) return;
    setIsSaving(true);
    try {
      await updateCVDetailsAction(cv.id, data);
      router.refresh();
    } catch (err) {
      console.error("Details update failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const fieldWrapper = "group relative rounded-lg border border-white/15 bg-[#353535] focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500/20 transition-all duration-300";
  const fieldLabel = "absolute left-3 -top-2.5 z-10 bg-[#353535] px-1.5 text-xs text-zinc-400 pointer-events-none select-none group-focus-within:text-red-500 transition-colors duration-300";
  const fieldInput = "w-full h-11 min-h-11 border-0 bg-transparent px-3 pt-4 pb-2 text-zinc-200 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0";

  return (
    <div className="flex justify-center pt-8">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-3xl space-y-6">
        <div className={fieldWrapper}>
          <Label className={fieldLabel}>{t("details.detailsTab.fields.name")}</Label>
          <Input {...register("name")} className={fieldInput} disabled={!canEdit} />
          {errors.name && <p className="text-xs text-red-400 mt-1 px-1">{errors.name.message}</p>}
        </div>

        <div className={fieldWrapper}>
          <Label className={fieldLabel}>{t("details.detailsTab.fields.education")}</Label>
          <Input {...register("education")} className={fieldInput} disabled={!canEdit} />
          {errors.education && <p className="text-xs text-red-400 mt-1 px-1">{errors.education.message}</p>}
        </div>

        <div className={fieldWrapper}>
          <Label className={fieldLabel}>{t("details.detailsTab.fields.description")}</Label>
          <textarea
            {...register("description")}
            rows={4}
            className={cn(fieldInput, "resize-none h-auto min-h-[100px] pt-4 pb-2")}
            disabled={!canEdit}
          />
          {errors.description && <p className="text-xs text-red-400 mt-1 px-1">{errors.description.message}</p>}
        </div>

        {canEdit && (
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={!isDirty || isSaving}
              className={cn(
                "uppercase text-xs tracking-widest rounded-4xl transition-all duration-300 h-10 px-8",
                (!isDirty || isSaving)
                  ? "bg-zinc-600 text-zinc-400 cursor-not-allowed border border-transparent"
                  : "bg-red-500 hover:bg-red-600 text-zinc-100 cursor-pointer"
              )}
            >
              {isSaving ? t("details.detailsTab.updating") : t("details.detailsTab.updateButton")}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
