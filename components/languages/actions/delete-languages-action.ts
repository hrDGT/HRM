"use server";

import { updateTag } from "next/cache";
import { getTranslations } from "next-intl/server";

import { gqlRequestAuthed } from '@/lib/gql/graphql-client';
import { getError } from "@/lib/utils";
import { graphql } from "@/gqlcodegen";

const DELETE_LANGUAGE_MUTATION = graphql(`
  mutation DeleteLanguage($language: DeleteLanguageInput!) {
    deleteLanguage(language: $language) {
      affected
    }
  }
`);

export async function deleteLanguageAction(languageId: string) {
  const t = await getTranslations("Languages.toasts");
  try {
    await gqlRequestAuthed(DELETE_LANGUAGE_MUTATION, {
      language: { languageId }
    });
    updateTag("languages");

    return { success: true };
  } catch (err) {
    return { error: getError(err, t("deleteError")) };
  }
}