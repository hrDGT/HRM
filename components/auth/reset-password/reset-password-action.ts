"use server"

import { ActionState } from "@/lib/auth/auth-types";
import { gqlRequest } from "@/lib/gql/graphql-client";
import { getError } from "@/lib/utils";
import { graphql } from "@/gqlcodegen";

import { ResetPasswordValue } from "./reset-password-schema";

const RESET_PASSWORD_MUTATION = graphql(`
  mutation ResetPassword($auth: ResetPasswordInput!) {
    resetPassword(auth: $auth)
  }
`);

export async function resetPasswordAction(
  token: string,
  _prevState: ActionState,
  data: ResetPasswordValue
): Promise<ActionState> {
  if (!token) {
    return { error: "Missing reset token. Please check your email link." };
  }

  try {
    await gqlRequest(
      RESET_PASSWORD_MUTATION,
      { auth: data },
      { Authorization: `Bearer ${token}` }
    );
    return { success: true };
  } catch (err) {
    return { error: getError(err, "Failed to reset password") };
  }
}