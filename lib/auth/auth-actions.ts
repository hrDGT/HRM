"use server";

import { redirect } from "next/navigation";
import { gqlRequest } from "@/lib/gql/graphql-client";
import { graphql } from "@/src/gql";
import { setAuthCookie } from "./auth-cookies";
import { type SignupFormValues } from "@/lib/schemas/auth";

export type ActionState = { error?: string } | null;

const SIGNUP_MUTATION = graphql(`
  mutation Signup($auth: AuthInput!) {
    signup(auth: $auth) {
      access_token
    }
  }
`);

export async function registerUserAction(
  _prevState: ActionState,
  data: SignupFormValues
): Promise<ActionState> {
  try {
    const result = await gqlRequest(SIGNUP_MUTATION, { auth: data });

    await setAuthCookie(result.signup.access_token);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Registration failed";
    return { error: errorMessage };
  }

  redirect("/");
}