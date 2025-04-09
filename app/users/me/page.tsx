import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RedirectToUserProfile() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  if (userId && !isNaN(Number(userId))) {
    redirect(`/users/${userId}`);
  }

  redirect("/auth/login");
}
