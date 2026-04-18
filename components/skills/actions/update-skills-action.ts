"use server";

import { updateTag } from "next/cache";
import { getTranslations } from "next-intl/server";

import { gqlRequestAuthed } from '@/lib/gql/graphql-client';
import { getError } from "@/lib/utils";
import { graphql } from "@/gqlcodegen";

const UPDATE_SKILL_MUTATION = graphql(`
  mutation UpdateSkill($skill: UpdateSkillInput!) {
    updateSkill(skill: $skill) {
      id
      name
    }
  }
`);

export async function updateSkillAction(skillId: string, name: string, categoryId: string) {
  const t = await getTranslations("Skills.toasts");
  try {
    await gqlRequestAuthed(UPDATE_SKILL_MUTATION, {
      skill: { skillId, name, categoryId }
    });
    updateTag("skills");

    return { success: true };
  } catch (err) {
    return { error: getError(err, t("updateError")) };
  }
} 8