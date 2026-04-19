"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { BaseFormModal } from "@/components/forms/ui/base-form-modal";
import { FormInput } from "@/components/forms/ui/form-input";
import { FormSelect } from "@/components/forms/ui/form-select";

import { updateSkillAction } from "../actions/update-skills-action";
import { getSkillsSchema, SkillsSchemaValues } from "../schemas/skills-schemas";

import type { Skill } from "./skills-page-content";

interface Props {
  skill: Skill;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryOptions: { label: string; value: string }[];
}

export function UpdateSkillModal({
  skill,
  open,
  onOpenChange,
  categoryOptions,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("Skills");
  const tCommon = useTranslations("Common");

  const skillsSchema = getSkillsSchema(t);

  const handleUpdate = (data: SkillsSchemaValues, closeModal: () => void) => {
    startTransition(async () => {
      const result = await updateSkillAction(
        skill.id,
        data.name,
        data.categoryId,
      );

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(t("toasts.updated"));
        closeModal();
      }
    });
  };

  return (
    <BaseFormModal
      actionTitle={t("updateModalTitle")}
      schema={skillsSchema}
      defaultValues={{
        name: skill.name,
        categoryId: skill.category?.id || "",
      }}
      onSubmit={handleUpdate}
      isPending={isPending}
      submitButtonTitleOnFetch={tCommon("actions.updating")}
      submitButtonTitle={tCommon("actions.update")}
      open={open}
      onOpenChange={onOpenChange}
    >
      <FormInput
        name="name"
        placeholder={tCommon("fields.name")}
        autoFocus
        autocompleteValue="off"
      />

      <FormSelect
        name="categoryId"
        options={categoryOptions}
        placeholder={tCommon("fields.category")}
      />
    </BaseFormModal>
  );
}
