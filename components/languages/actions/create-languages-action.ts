"use server";

import { updateTag } from "next/cache";
import { getTranslations } from "next-intl/server";

import { gqlRequestAuthed } from '@/lib/gql/graphql-client';
import { getError } from "@/lib/utils";
import { graphql } from "@/gqlcodegen";

const CREATE_LANGUAGE_MUTATION = graphql(`
  mutation CreateLanguage($language: CreateLanguageInput!) {
    createLanguage(language: $language) {
      id,
      iso2
      name
      native_name
    }
  }
`);

export async function createLanguageAction(name: string, iso2: string, native_name?: string) {
  const t = await getTranslations("Languages.toasts");
  try {
    await gqlRequestAuthed(CREATE_LANGUAGE_MUTATION, {
      language: { name, native_name, iso2 }
    });
    updateTag("languages");

    return { success: true };
  } catch (err) {
    return { error: getError(err, t("createError")) };
  }
}