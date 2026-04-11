"use server"

import { redirect } from "next/navigation";

import { LoginFormValues } from "@/components/auth/schemas/login-schema";
import { setAuthCookies } from "@/lib/auth/auth-cookies";
import { ActionState } from "@/lib/auth/auth-types";
import { gqlFetch } from "@/lib/gql/graphql-client";
import { getError } from "@/lib/utils";
import { graphql } from "@/gqlcodegen";

const LOGIN_QUERY = graphql(`
  query Login($auth: AuthInput!) {
    login(auth: $auth) {
      user {
        id
      }
      access_token
      refresh_token
    }
  }
`);

export async function loginUserAction(_prevState: ActionState, data: LoginFormValues): Promise<ActionState> {
  try {
    const result = await gqlFetch(LOGIN_QUERY, { auth: data });

    await setAuthCookies(
      result.login.access_token,
      result.login.refresh_token,
      result.login.user.id
    );
  } catch (err) {
    return { error: getError(err, "Login failed") };
  }
  redirect("/");
}