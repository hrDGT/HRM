import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function RedirectToUserProfile() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    const userIdNum = Number(userId);
    if (userId && Number.isInteger(userIdNum) && userIdNum > 0) {
      redirect(`/users/${userIdNum}`);
    }
  } catch (error) {
    console.error("[/users/me] Error:", error);
  }

  redirect("/auth/login");
}
