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

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
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

      const nextResponse = NextResponse.json({ 
        success: true,
        access_token,
        refresh_token 
      });

      const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax" as const,
      };

      nextResponse.cookies.set("access_token", access_token, {
        ...options,
        maxAge: 60 * 60 * 24 * 7,
      });
      nextResponse.cookies.set("refresh_token", refresh_token, {
        ...options,
        maxAge: 60 * 60 * 24 * 30,
      });

      return nextResponse;
    }

    return NextResponse.json({ error: "Token refresh failed" }, { status: 401 });
  } catch (error) {
    console.error("Refresh error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
