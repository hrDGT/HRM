"use server"

import { ActionState } from "@/lib/auth/auth-types";
import { gqlFetch } from "@/lib/gql/graphql-client";
import { getError } from "@/lib/utils";
import { graphql } from "@/gqlcodegen";

import { ForgotPasswordValues } from "./forgot-password-schema";

const FORGOT_PASSWORD_MUTATION = graphql(`
  mutation ForgotPassword($auth: ForgotPasswordInput!) {
    forgotPassword(auth: $auth)
  }
`);

export async function forgotPasswordAction(
  _prevState: ActionState,
  data: ForgotPasswordValues
): Promise<ActionState> {
  try {
    await gqlFetch(FORGOT_PASSWORD_MUTATION, { auth: data });

    return { success: true };
  } catch (err) {
    return { error: getError(err, "Failed to send email") };
  }
}