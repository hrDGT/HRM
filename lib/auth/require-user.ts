import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { gqlRequestAuthed } from "@/lib/gql/graphql-client";

import { GET_USER_FOR_STORE } from "../user/user-queries";

export async function requireUser() {
  const cookieStore = await cookies();
  const headersList = await headers();
  const userId = cookieStore.get("user_id")?.value;

  const currentPath = headersList.get("x-current-path") || "/users";
  const refreshUrl = `/api/auth/refresh?callbackUrl=${encodeURIComponent(currentPath)}`;

  if (!userId) redirect(refreshUrl);

  try {
    const response = await gqlRequestAuthed(GET_USER_FOR_STORE, { userId });
    if (!response.user) redirect(refreshUrl);
    return response.user;
  } catch {
    redirect(refreshUrl);
  }
}