"use server";

import { cookies } from "next/headers";
import { print } from "graphql";

import { graphql } from "@/gqlcodegen";

import { setAuthCookies } from "./auth-cookies";

const UPDATE_TOKEN_MUTATION = graphql(`
  mutation UpdateToken {
    updateToken {
      access_token
      refresh_token
    }
  }
`);

export async function getNewTokens(refreshToken: string) {
  try {
    const response = await fetch(process.env.GRAPHQL_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
      body: JSON.stringify({ query: print(UPDATE_TOKEN_MUTATION) }),
    });

    const result = await response.json();
    return result.data?.updateToken || null;
  } catch (error) {
    console.error("Failed to fetch new tokens:", error);
    return null;
  }
}

export async function refreshTokensAction() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) return null;

    const tokens = await getNewTokens(refreshToken);

    if (tokens) {
      await setAuthCookies(tokens.access_token, tokens.refresh_token);
      return tokens.access_token;
    }

    return null;
  } catch (error) {
    console.error("Refresh error:", error);
    return null;
  }
}