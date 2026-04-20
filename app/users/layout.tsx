import { requireUser } from "@/lib/auth/require-user";
import { gqlRequestAuthed } from "@/lib/gql/graphql-client";
import type { GetUserForStoreQuery, UserRole } from "@/gqlcodegen/graphql";
import { GET_USER_FOR_STORE } from "@/lib/user/user-queries";
import { UsersLayoutClient } from "./_components/users-layout-client";
import { type StoreUser } from "@/store/use-user-store";

export default async function UsersLayout({ children }: { children: React.ReactNode }) {
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
    <UsersLayoutClient initialUser={storeUser}>
      {children}
    </UsersLayoutClient>
  );
}
