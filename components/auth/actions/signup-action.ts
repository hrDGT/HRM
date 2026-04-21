"use server"

import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { type SignupFormValues } from "@/components/auth/schemas/signup-schema";
import { setAuthCookies } from "@/lib/auth/auth-cookies";
import { type ActionState } from "@/lib/auth/auth-types";
import { gqlFetch } from "@/lib/gql/graphql-client";
import { getError } from "@/lib/utils";
import { graphql } from "@/gqlcodegen";

const SIGNUP_MUTATION = graphql(`
  mutation Signup($auth: AuthInput!) {
    signup(auth: $auth) {
      user {
        id
      }
      access_token
      refresh_token
    }
  }
`);

export async function signUpUserAction(_prevState: ActionState, data: SignupFormValues): Promise<ActionState> {
  const t = await getTranslations("Auth.signUp");
  try {
    const result = await gqlFetch(SIGNUP_MUTATION, { auth: data });

    await setAuthCookies(
      result.signup.access_token,
      result.signup.refresh_token,
      result.signup.user.id
    );
  } catch (err) {
    return { error: getError(err, t("error")) };
  }
  redirect("/users");
}