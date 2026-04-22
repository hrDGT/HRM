"use server"

import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";

import { type ForgotPasswordFormValues } from "@/components/auth/schemas/forgot-password-schema";
import { ActionState } from "@/lib/auth/auth-types";
import { gqlFetch } from "@/lib/gql/graphql-client";
import { getError } from "@/lib/utils";
import { graphql } from "@/gqlcodegen";

const FORGOT_PASSWORD_MUTATION = graphql(`
  mutation ForgotPassword($auth: ForgotPasswordInput!) {
    forgotPassword(auth: $auth)
  }
`);

export async function forgotPasswordAction(
  _prevState: ActionState,
  data: ForgotPasswordFormValues
): Promise<ActionState> {
  const t = await getTranslations("Auth.forgotPassword");
  try {
    const headersList = await headers();
    const origin = headersList.get("origin") || headersList.get("host");

    const baseUrl = origin ? (origin.startsWith('http') ? origin : `http://${origin}`) : 'http://localhost:3000';

    await gqlFetch(
      FORGOT_PASSWORD_MUTATION,
      { auth: data },
      {
        headers: { origin: baseUrl }
      }
    );

    return { success: true };
  } catch (err) {
    return { error: getError(err, t("sendError")) };
  }
}