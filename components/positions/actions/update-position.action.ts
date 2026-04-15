"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";

import { gqlRequestAuthed } from '@/lib/gql/graphql-client';
import { getError } from "@/lib/utils";
import { graphql } from "@/gqlcodegen";

const UPDATE_POSITION_MUTATION = graphql(`
  mutation UpdatePosition($position: UpdatePositionInput!) {
    updatePosition(position: $position) {
      id,
      name
    }
  }
`);

export async function updatePositionAction(positionId: string, name: string) {
  const t = await getTranslations("Positions.toasts");
  try {
    await gqlRequestAuthed(UPDATE_POSITION_MUTATION, {
      position: { positionId, name }
    });
    revalidatePath("/positions");

    return { success: true };
  } catch (err) {
    return { error: getError(err, t("updateError")) };
  }
}