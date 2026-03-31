import { cookies } from "next/headers";

export async function setAuthCookies(access: string, refresh: string) {
  const cookieStore = await cookies();

  const options = {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "lax" as const,
  };

  cookieStore.set("access_token", access, { ...options, maxAge: 60 * 60 * 24 * 7 });
  cookieStore.set("refresh_token", refresh, { ...options, maxAge: 60 * 60 * 24 * 30 });
}