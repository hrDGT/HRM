"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { BaseFormModal } from "@/components/forms/ui/base-form-modal";
import { FormInput } from "@/components/forms/ui/form-input";

import { updateDepartmentAction } from "../actions/update-departments-action";
import {
  departmentsSchema,
  DepartmentsSchemaValues,
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

  const handleUpdate = (
    data: DepartmentsSchemaValues,
    closeModal: () => void,
  ) => {
    startTransition(async () => {
      const result = await updateDepartmentAction(department.id, data.name);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Department updated successfully");
        closeModal();
      }
    });
  };

  return (
    <BaseFormModal
      actionTitle="Update Department"
      schema={departmentsSchema}
      defaultValues={{ name: department.name }}
      onSubmit={handleUpdate}
      isPending={isPending}
      submitButtonTitleOnFetch="Updating..."
      submitButtonTitle="Update"
      open={open}
      onOpenChange={onOpenChange}
    >
      <FormInput
        name="name"
        placeholder="Name"
        autoFocus
        autocompleteValue="off"
      />
    </BaseFormModal>
  );
}
