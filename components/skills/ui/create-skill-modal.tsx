"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { BaseFormModal } from "@/components/forms/ui/base-form-modal";
import { FormInput } from "@/components/forms/ui/form-input";
import { FormSelect } from "@/components/forms/ui/form-select";
import { Button } from "@/components/ui/button";

import { createSkillAction } from "../actions/create-skills-action";
import { getSkillsSchema, SkillsSchemaValues } from "../schemas/skills-schemas";

type Props = {
  categoryOptions: { label: string; value: string }[];
};

export function CreateSkillModal({ categoryOptions }: Props) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("Skills");
  const tCommon = useTranslations("Common");

  const skillsSchema = getSkillsSchema(t);

  const handleCreate = (data: SkillsSchemaValues, closeModal: () => void) => {
    startTransition(async () => {
      const result = await createSkillAction(data.name, data.categoryId);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(t("toasts.created"));
        closeModal();
      }
    });
  };

  return (
    <BaseFormModal
      actionTitle={t("createModalTitle")}
      schema={skillsSchema}
      defaultValues={{ name: "", categoryId: "" }}
      onSubmit={handleCreate}
      isPending={isPending}
      submitButtonTitleOnFetch={tCommon("actions.creating")}
      submitButtonTitle={tCommon("actions.create")}
      trigger={
        <Button
          type="button"
          aria-label={t("createButton")}
          className="gap-x-2 aspect-square text-primary text-sm uppercase rounded-xl hover:bg-hover-action-create-btn p-0 md:px-2"
        >
          <Plus className="size-5" />
          <span className="hidden md:block">{t("createButton")}</span>
        </Button>
      }
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
