import { cookies } from "next/headers";
import { gqlRequest } from "@/lib/gql/graphql-client";
import { graphql } from "@/gqlcodegen";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { UsersLayoutClient } from "./_components/users-layout-client";

type UserProfileQueryResult = {
  user: {
    id: string;
    profile: {
      first_name: string | null;
      last_name: string | null;
      avatar: string | null;
    } | null;
  } | null;
};

const GET_CURRENT_USER_PROFILE = graphql(`
  query GetCurrentUserProfile($userId: ID!) {
    user(userId: $userId) {
      id
      profile {
        first_name
        last_name
        avatar
      }
    }
  }
`) as TypedDocumentNode<UserProfileQueryResult, { userId: string }>;

export default async function UsersLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const rawId = cookieStore.get("user_id")?.value;
  const userId = rawId ? Number(rawId) : 0;

  let currentUser = null;

  if (userId > 0) {
    try {
      const result = await gqlRequest(GET_CURRENT_USER_PROFILE, { userId: String(userId) });
      if (result.user?.profile) {
        currentUser = {
          id: result.user.id,
          firstName: result.user.profile.first_name || "",
          lastName: result.user.profile.last_name || "",
          avatar: result.user.profile.avatar || null,
        };
      }
    } catch {
      currentUser = null;
    }
  }

  return (
    <UsersLayoutClient currentUser={currentUser}>
      {children}
    </UsersLayoutClient>
  );
}
