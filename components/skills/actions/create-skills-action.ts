"use server";

import { updateTag } from "next/cache";
import { getTranslations } from "next-intl/server";

import { gqlRequestAuthed } from '@/lib/gql/graphql-client';
import { getError } from "@/lib/utils";
import { graphql } from "@/gqlcodegen";

const CREATE_SKILL_MUTATION = graphql(`
  mutation CreateSkill($skill: CreateSkillInput!) {
    createSkill(skill: $skill) {
      id
      name
    }
  }
`);

export async function createSkillAction(name: string, categoryId: string) {
  const t = await getTranslations("Skills.toasts");
  try {
    await gqlRequestAuthed(CREATE_SKILL_MUTATION, {
      skill: {
        name,
        categoryId
      }
    });

    updateTag("skills");

    return { success: true };
  } catch (err) {
    return { error: getError(err, t("createError")) };
  }
}