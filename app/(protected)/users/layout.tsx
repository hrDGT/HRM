import { PropsWithChildren } from "react";

import { requireUser } from "@/lib/auth/require-user";
import { gqlRequestAuthed } from "@/lib/gql/graphql-client";
import { GET_USER_FOR_STORE } from "@/lib/user/user-queries";
import type { UserRole } from "@/gqlcodegen/graphql";
import { type StoreUser } from "@/store/use-user-store";

import { UsersLayoutClient } from "./_components/users-layout-client";

export default async function UsersLayout({ children }: PropsWithChildren) {
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
    <UsersLayoutClient initialUser={storeUser}>{children}</UsersLayoutClient>
  );
}
