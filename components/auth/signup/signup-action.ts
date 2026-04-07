"use server"

import { type SignupFormValues } from "./signup-schema";
import { gqlRequest } from "@/lib/gql/graphql-client";
import { setAuthCookies } from "@/lib/auth/auth-cookies";
import { getError } from "@/lib/utils";
import { redirect } from "next/navigation";
import { type ActionState } from "@/lib/auth/auth-types";
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
  try {
    const result = await gqlRequest(SIGNUP_MUTATION, { auth: data });

    await setAuthCookies(
      result.signup.access_token,
      result.signup.refresh_token,
      result.signup.user.id
    );
  } catch (err) {
    return { error: getError(err, "Registration failed") };
  }
  redirect("/");
}