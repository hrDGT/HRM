import { useTransition } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { BaseFormModal } from "@/components/forms/ui/base-form-modal";
import { FormInput } from "@/components/forms/ui/form-input";
import { Button } from "@/components/ui/button";

import { createDepartmentAction } from "../actions/create-departments-action";
import {
  departmentsSchema,
  DepartmentsSchemaValues,
} from "../schemas/departments-schema";

export function CreateDepartmentModal() {
  const [isPending, startTransition] = useTransition();

  const handleCreate = (
    data: DepartmentsSchemaValues,
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
    <BaseFormModal
      actionTitle="Create Department"
      schema={departmentsSchema}
      defaultValues={{ name: "" }}
      onSubmit={handleCreate}
      isPending={isPending}
      submitButtonTitleOnFetch="Creating..."
      submitButtonTitle="Create"
      trigger={
        <Button
          type="button"
          aria-label="Create department"
          className="gap-x-2 aspect-square text-main-red text-sm uppercase rounded-xl hover:bg-action-hover p-0 md:px-2"
        >
          <Plus className="size-5" />
          <span className="hidden md:block">Create department</span>
        </Button>
      }
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
