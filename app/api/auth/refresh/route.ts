import { cookies } from "next/headers";
import { NextResponse } from "next/server";
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

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  sameSite: "lax" as const,
};

async function clearAndRedirect(url: string, callbackUrl: string) {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
  cookieStore.delete("user_id");

  const loginUrl = new URL("/auth/login", url);
  return NextResponse.redirect(loginUrl);
}

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;
  const userId = cookieStore.get("user_id")?.value;

  const { searchParams } = new URL(request.url);
  const rawCallbackUrl = searchParams.get("callbackUrl") || "/users";
  const safeCallbackUrl = rawCallbackUrl.startsWith("/") ? rawCallbackUrl : "/users";

  if (!refreshToken || !userId) {
    return clearAndRedirect(request.url, safeCallbackUrl);
  }

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
      const { access_token, refresh_token } = result.data.updateToken;

      const nextResponse = NextResponse.redirect(new URL(safeCallbackUrl, request.url));

      nextResponse.cookies.set("access_token", access_token, { ...cookieOptions, maxAge: 60 * 60 * 24 * 7 });
      nextResponse.cookies.set("refresh_token", refresh_token, { ...cookieOptions, maxAge: 60 * 60 * 24 * 30 });

      return nextResponse;
    }
    return clearAndRedirect(request.url, safeCallbackUrl);
  } catch {
    return clearAndRedirect(request.url, safeCallbackUrl);
  }
}