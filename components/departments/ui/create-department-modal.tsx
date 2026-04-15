"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { BaseFormModal } from "@/components/forms/ui/base-form-modal";
import { FormInput } from "@/components/forms/ui/form-input";
import { Button } from "@/components/ui/button";

import { createDepartmentAction } from "../actions/create-departments-action";
import {
  DepartmentsSchemaValues,
  getDepartmentsSchema,
} from "../schemas/departments-schema";

export function CreateDepartmentModal() {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("Departments");
  const tCommon = useTranslations("Common");

  const departmentsSchema = getDepartmentsSchema(t);

  const handleCreate = (
    data: DepartmentsSchemaValues,
    closeModal: () => void,
  ) => {
    startTransition(async () => {
      const result = await createDepartmentAction(data.name);

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
      schema={departmentsSchema}
      defaultValues={{ name: "" }}
      onSubmit={handleCreate}
      isPending={isPending}
      submitButtonTitleOnFetch={tCommon("actions.creating")}
      submitButtonTitle={tCommon("actions.create")}
      trigger={
        <Button
          type="button"
          aria-label={t("createButton")}
          className="gap-x-2 aspect-square text-main-red text-sm uppercase rounded-xl hover:bg-action-hover p-0 md:px-2"
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
    </BaseFormModal>
  );
}
