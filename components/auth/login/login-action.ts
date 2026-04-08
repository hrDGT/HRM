"use server"

import { redirect } from "next/navigation";

import { setAuthCookies } from "@/lib/auth/auth-cookies";
import { ActionState } from "@/lib/auth/auth-types";
import { gqlRequest } from "@/lib/gql/graphql-client";
import { getError } from "@/lib/utils";
import { graphql } from "@/gqlcodegen";

import { LoginFormValues } from "./login-schema";

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
    const result = await gqlRequest(LOGIN_QUERY, { auth: data });

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