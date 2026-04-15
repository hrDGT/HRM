import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { gqlRequestAuthed } from "@/lib/gql/graphql-client";

import { GET_USER_FOR_STORE } from "../user/user-queries";

export async function requireUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  if (!userId) {
    redirect("/auth/login");
  }

  let user = null;

  try {
    const response = await gqlRequestAuthed(GET_USER_FOR_STORE, { userId });
    user = response.user;
  } catch (error) {
    console.error("Failed to load user:", error);
  }

  if (!user) {
    redirect("/auth/login");
  }

  return user;
}