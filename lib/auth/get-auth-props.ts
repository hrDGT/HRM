import { cookies } from "next/headers";

export async function getAuthProps() {
  const cookieStore = await cookies();
  return {
    token: cookieStore.get("access_token")?.value,
    cookieHeader: cookieStore.getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; "),
  };
}
