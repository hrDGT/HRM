"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { BaseFormModal } from "@/components/forms/ui/base-form-modal";
import { FormInput } from "@/components/forms/ui/form-input";

import { updatePositionAction } from "../actions/update-positions-action";
import {
  getPositionsSchema,
  PositionsSchemaValues,
} from "../schemas/positions-schema";

interface Props {
  position: { id: string; name: string };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdatePositionModal({ position, open, onOpenChange }: Props) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("Positions");
  const tCommon = useTranslations("Common");

  const positionsSchema = getPositionsSchema(t);

  const handleUpdate = (
    data: PositionsSchemaValues,
    closeModal: () => void,
  ) => {
    startTransition(async () => {
      const result = await updatePositionAction(position.id, data.name);

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
      schema={positionsSchema}
      defaultValues={{ name: position.name }}
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
