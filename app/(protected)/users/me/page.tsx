import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/require-user";

export default async function RedirectToUserProfile() {
  const user = await requireUser();
  redirect(`/users/${user.id}`);
}
