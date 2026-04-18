"use server";

import { updateTag } from "next/cache";
import { getTranslations } from "next-intl/server";

import { gqlRequestAuthed } from '@/lib/gql/graphql-client';
import { getError } from "@/lib/utils";
import { graphql } from "@/gqlcodegen";

const DELETE_SKILL_MUTATION = graphql(`
  mutation DeleteSkill($skill: DeleteSkillInput!) {
    deleteSkill(skill: $skill) {
      affected
    }
  }
`);

export async function deleteSkillAction(skillId: string) {
  const t = await getTranslations("Skills.toasts");
  try {
    await gqlRequestAuthed(DELETE_SKILL_MUTATION, {
      skill: { skillId }
    });
    updateTag("skills");

    return { success: true };
  } catch (err) {
    return { error: getError(err, t("deleteError")) };
  }
}