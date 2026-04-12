import { useTransition } from "react";
import { toast } from "sonner";

import { BaseFormModal } from "@/components/forms/ui/base-form-modal";
import { FormInput } from "@/components/forms/ui/form-input";

import { createDepartmentAction } from "../actions/create-departments-action";
import {
  createDepartmentSchema,
  type CreateDepartmentSchemaValues,
} from "../schemas/create-department-schema";

export function CreateDepartmentModal() {
  const [isPending, startTransition] = useTransition();

  const handleCreate = (
    data: CreateDepartmentSchemaValues,
    closeModal: () => void,
  ) => {
    startTransition(async () => {
      const result = await createDepartmentAction(data.name);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Department created successfully");
        closeModal();
      }
    });
  };

  return (
    <BaseFormModal<CreateDepartmentSchemaValues>
      actionTitle="Create Department"
      schema={createDepartmentSchema}
      defaultValues={{ name: "" }}
      onSubmit={handleCreate}
      isPending={isPending}
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
