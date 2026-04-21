"use server"

import { getTranslations } from "next-intl/server";

import { type ResetPasswordFormValues } from "@/components/auth/schemas/reset-password-schema";
import { ActionState } from "@/lib/auth/auth-types";
import { gqlFetch } from "@/lib/gql/graphql-client";
import { getError } from "@/lib/utils";
import { graphql } from "@/gqlcodegen";

const RESET_PASSWORD_MUTATION = graphql(`
  mutation ResetPassword($auth: ResetPasswordInput!) {
    resetPassword(auth: $auth)
  }
`);

export async function resetPasswordAction(
  token: string,
  _prevState: ActionState,
  data: ResetPasswordFormValues
): Promise<ActionState> {
  const t = await getTranslations("Auth.resetPassword");
  if (!token) {
    return { error: t('tokenError') };
  }

  try {
    await gqlFetch(
      RESET_PASSWORD_MUTATION,
      { auth: data },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { success: true };
  } catch (err) {
    return { error: getError(err, t('error')) };
  }
}