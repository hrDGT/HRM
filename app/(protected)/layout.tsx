import { PropsWithChildren } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { UserProvider } from "@/components/providers/user-provider";
import { gqlRequest } from "@/lib/gql/graphql-client";
import { GET_USER_FOR_STORE } from "@/lib/user/user-queries";

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  if (!userId) {
    redirect("/auth/login");
  }

  let currentUser = null;

  try {
    const response = await gqlRequest(GET_USER_FOR_STORE, { userId });
    currentUser = response.user;

    if (!currentUser) {
      redirect("/auth/login");
    }
  } catch (error) {
    console.error("Failed to load user:", error);
    redirect("/auth/login");
  }

  return (
    <UserProvider user={currentUser}>
      <div className="flex min-h-screen flex-col bg-background">
        <main className="flex-1">{children}</main>
      </div>
    </UserProvider>
  );
}
