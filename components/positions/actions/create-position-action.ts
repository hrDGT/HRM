"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";

import { gqlRequestAuthed } from '@/lib/gql/graphql-client';
import { getError } from "@/lib/utils";
import { graphql } from "@/gqlcodegen";

const CREATE_POSITION_MUTATION = graphql(`
  mutation CreatePosition($position: CreatePositionInput!) {
    createPosition(position: $position) {
      id,
      name
    }
  }
`);

export async function createPositionAction(name: string) {
  const t = await getTranslations("Positions.toasts");
  try {
    await gqlRequestAuthed(CREATE_POSITION_MUTATION, {
      position: { name }
    });
    revalidatePath("/positions");

    return { success: true };
  } catch (err) {
    return { error: getError(err, t("createError")) };
  }
}