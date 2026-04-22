"use server"

import { cookies } from "next/headers";

export async function logoutAction() {
  const cookieStore = await cookies();

  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
  cookieStore.delete("user_id");

  return { success: true };
}