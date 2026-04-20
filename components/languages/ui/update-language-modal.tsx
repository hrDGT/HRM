"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { BaseFormModal } from "@/components/forms/ui/base-form-modal";
import { FormInput } from "@/components/forms/ui/form-input";

import { updateLanguageAction } from "../actions/update-languages-action";
import {
  getLanguagesSchema,
  LanguagesSchemaValues,
} from "../schemas/languages-schema";

interface Props {
  language: {
    id: string;
    name: string;
    iso2: string;
    native_name?: string | null;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateLanguageModal({ language, open, onOpenChange }: Props) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("Languages");
  const tCommon = useTranslations("Common");

  const languagesSchema = getLanguagesSchema(t);

  const handleUpdate = (
    data: LanguagesSchemaValues,
    closeModal: () => void,
  ) => {
    startTransition(async () => {
      const result = await updateLanguageAction(
        language.id,
        data.name,
        data.iso2,
        data.native_name,
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
      schema={languagesSchema}
      defaultValues={{
        name: language.name,
        iso2: language.iso2,
        native_name: language.native_name || "",
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
      <FormInput
        name="native_name"
        placeholder={tCommon("fields.nativeName")}
        autocompleteValue="off"
      />
      <FormInput
        name="iso2"
        placeholder={tCommon("fields.iso2")}
        autocompleteValue="off"
      />
    </BaseFormModal>
  );
}
