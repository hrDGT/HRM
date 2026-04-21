"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { BaseFormModal } from "@/components/forms/ui/base-form-modal";
import { FormInput } from "@/components/forms/ui/form-input";
import { Button } from "@/components/ui/button";

import { createLanguageAction } from "../actions/create-languages-action";
import {
  getLanguagesSchema,
  LanguagesSchemaValues,
} from "../schemas/languages-schema";

export function CreateLanguageModal() {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("Languages");
  const tCommon = useTranslations("Common");

  const languagesSchema = getLanguagesSchema(t);

  const handleCreate = (
    data: LanguagesSchemaValues,
    closeModal: () => void,
  ) => {
    startTransition(async () => {
      const result = await createLanguageAction(
        data.name,
        data.iso2,
        data.native_name,
      );

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
      schema={languagesSchema}
      defaultValues={{ name: "", native_name: "", iso2: "" }}
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
