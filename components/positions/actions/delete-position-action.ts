"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";

import { gqlRequestAuthed } from '@/lib/gql/graphql-client';
import { getError } from "@/lib/utils";
import { graphql } from "@/gqlcodegen";

const DELETE_POSITION_MUTATION = graphql(`
  mutation DeletePosition($position: DeletePositionInput!) {
    deletePosition(position: $position) {
      affected
    }
  }
`);

export async function deletePositionAction(positionId: string) {
  const t = await getTranslations("Positions.toasts");
  try {
    await gqlRequestAuthed(DELETE_POSITION_MUTATION, {
      position: { positionId }
    });
    revalidatePath("/positions");

    return { success: true };
  } catch (err) {
    return { error: getError(err, t("deleteError")) };
  }
}