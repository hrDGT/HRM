"use server";

import { redirect } from "next/navigation";
import { gqlRequest } from "@/lib/gql/graphql-client";
import { graphql } from "@/gqlcodegen";
import { setAuthCookies } from "./auth-cookies";
import { type LoginFormValues, type SignupFormValues } from "@/lib/schemas/auth";

export type ActionState = { error?: string } | null;

const SIGNUP_MUTATION = graphql(`
  mutation Signup($auth: AuthInput!) {
    signup(auth: $auth) {
      access_token
      refresh_token
    }
  }
`);

const LOGIN_QUERY = graphql(`
  query Login($auth: AuthInput!) {
    login(auth: $auth) {
    user {
        id
        email
      }
      access_token
      refresh_token
    }
  }
`)

export async function signUpUserAction(
  _prevState: ActionState,
  data: SignupFormValues
): Promise<ActionState> {
  try {
    const result = await gqlRequest(SIGNUP_MUTATION, { auth: data });

    await setAuthCookies(result.signup.access_token, result.signup.refresh_token);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Registration failed";
    return { error: errorMessage };
  }

  redirect("/");
}

export async function loginUserAction(
  _prevState: ActionState,
  data: LoginFormValues
): Promise<ActionState> {
  try {
    const result = await gqlRequest(LOGIN_QUERY, { auth: data });
    console.log("Full Result from Backend:", JSON.stringify(result, null, 2));
    await setAuthCookies(result.login.access_token, result.login.refresh_token);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Login failed";
    return { error: errorMessage };
  }

  redirect("/");
}