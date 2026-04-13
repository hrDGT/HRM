"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { BaseFormModal } from "@/components/forms/ui/base-form-modal";
import { FormInput } from "@/components/forms/ui/form-input";

import { updateDepartmentAction } from "../actions/update-departments-action";
import {
  DepartmentsSchemaValues,
  getDepartmentsSchema,
} from "../schemas/departments-schema";

interface Props {
  department: { id: string; name: string };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateDepartmentModal({
  department,
  open,
  onOpenChange,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("Departments");
  const tCommon = useTranslations("Common");

  const departmentsSchema = getDepartmentsSchema(t);

  const handleUpdate = (
    data: DepartmentsSchemaValues,
    closeModal: () => void,
  ) => {
    startTransition(async () => {
      const result = await updateDepartmentAction(department.id, data.name);

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
      schema={departmentsSchema}
      defaultValues={{ name: department.name }}
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
    </BaseFormModal>
  );
}
