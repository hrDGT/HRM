"use server";

import { updateTag } from "next/cache";
import { getTranslations } from "next-intl/server";

import { gqlRequestAuthed } from '@/lib/gql/graphql-client';
import { getError } from "@/lib/utils";
import { graphql } from "@/gqlcodegen";

const UPDATE_LANGUAGE_MUTATION = graphql(`
  mutation UpdateLanguage($language: UpdateLanguageInput!) {
    updateLanguage(language: $language) {
      id
      iso2
      name
      native_name
    }
  }
`);

export async function updateLanguageAction(languageId: string, name: string, iso2: string, native_name?: string | null) {
  const t = await getTranslations("Languages.toasts");
  try {
    await gqlRequestAuthed(UPDATE_LANGUAGE_MUTATION, {
      language: { languageId, iso2, name, native_name }
    });
    updateTag("languages");

    return { success: true };
  } catch (err) {
    return { error: getError(err, t("updateError")) };
  }
}