"use server";

import { redirect } from "next/navigation";
import { gqlRequest } from "@/lib/gql/graphql-client";
import { graphql } from "@/gqlcodegen";
import { setAuthCookies } from "./auth-cookies";
import { ForgotPasswordValues, ResetPasswordValue, type LoginFormValues, type SignupFormValues } from "@/lib/schemas/auth";

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

const FORGOT_PASSWORD_MUTATION = graphql(`
  mutation ForgotPassword($auth: ForgotPasswordInput!) {
    forgotPassword(auth: $auth)
  }
`)

const RESET_PASSWORD_MUTATION = graphql(`
  mutation ResetPassword($auth: ResetPasswordInput!) {
    resetPassword(auth: $auth)
  }
`);

export async function signUpUserAction(_prevState: ActionState, data: SignupFormValues): Promise<ActionState> {
  try {
    const result = await gqlRequest(SIGNUP_MUTATION, { auth: data });
    await setAuthCookies(result.signup.access_token, result.signup.refresh_token);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Registration failed" };
  }
  redirect("/");
}


export async function loginUserAction(_prevState: ActionState, data: LoginFormValues): Promise<ActionState> {
  try {
    const result = await gqlRequest(LOGIN_QUERY, { auth: data });
    await setAuthCookies(result.login.access_token, result.login.refresh_token);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Login failed" };
  }
  redirect("/");
}

export async function forgotPasswordAction(_prevState: ActionState, data: ForgotPasswordValues): Promise<ActionState> {
  try {
    await gqlRequest(FORGOT_PASSWORD_MUTATION, { auth: data })
  }
  catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to send email" };
  }
  redirect('/auth/login')
}

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
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to reset password" };
  }

  redirect("/auth/login");
}