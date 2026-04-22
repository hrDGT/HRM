import { PropsWithChildren } from "react";

import { ProtectedLayoutClient } from "@/components/common/protected-layout-client";
import { UserProvider } from "@/components/providers/user-provider";
import { requireUser } from "@/lib/auth/require-user";
import { gqlRequestAuthed } from "@/lib/gql/graphql-client";
import { GET_USER_FOR_STORE } from "@/lib/user/user-queries";
import type { UserRole } from "@/gqlcodegen/graphql";
import { type StoreUser } from "@/store/use-user-store";

export default async function ProtectedLayout({ children }: PropsWithChildren) {
  const currentUser = await requireUser();

  const result = await gqlRequestAuthed(GET_USER_FOR_STORE, {
    userId: String(currentUser.id),
  }).catch(() => null);

  const storeUser: StoreUser | null = result?.user
    ? {
        id: result.user.id,
        role: result.user.role as UserRole,
        profile: {
          first_name: result.user.profile?.first_name ?? null,
          last_name: result.user.profile?.last_name ?? null,
          avatar: result.user.profile?.avatar ?? null,
        },
      }
    : null;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col">
        <UserProvider user={currentUser}>
          <ProtectedLayoutClient initialUser={storeUser}>
            {children}
          </ProtectedLayoutClient>
        </UserProvider>
      </main>
    </div>
  );
}
