import { cookies } from "next/headers";

export async function setAuthCookies(access: string, refresh: string, userId?: string) {
  const cookieStore = await cookies();

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax" as const,
  };

  cookieStore.set("access_token", access, { ...options, maxAge: 60 * 60 * 24 * 7 });
  cookieStore.set("refresh_token", refresh, { ...options, maxAge: 60 * 60 * 24 * 30 });

  if (userId) {
    cookieStore.set("user_id", userId, { ...options, maxAge: 60 * 60 * 24 * 30 });
  }
}