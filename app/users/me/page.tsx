import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function RedirectToUserProfile() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  const userIdNum = userId ? Number(userId) : NaN;

  if (Number.isInteger(userIdNum) && userIdNum > 0) {
    redirect(`/users/${userIdNum}`);
  }

  redirect("/auth/login");
}
