"use server";

import { cookies } from "next/headers";
import { print } from "graphql";

import { graphql } from "@/gqlcodegen";

const UPDATE_TOKEN_MUTATION = graphql(`
  mutation UpdateToken {
    updateToken {
      access_token
      refresh_token
    }
  }
`);

export async function refreshTokensAction() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) return null;

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

    if (result.data?.updateToken) {
      return result.data.updateToken.access_token;
    }
    return null;
  } catch (error) {
    console.error("Refresh error:", error);
    return null;
  }
}
