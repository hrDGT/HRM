import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/require-user";
import { gqlRequestAuthed } from "@/lib/gql/graphql-client";
import { graphql } from "@/gqlcodegen";
import type { ResultOf, TypedDocumentNode } from "@graphql-typed-document-node/core";
import { EmployeeProfile } from "@/lib/users/users-types";
import { UserProfileClient } from "./_components/user-profile-client";
import { getDepartments, getPositions } from "./actions";
import { getTranslations } from "next-intl/server";
import { getAuthProps } from "@/lib/auth/get-auth-props";

const GET_EMPLOYEE_QUERY = graphql(`
  query GetEmployee($userId: ID!) {
    user(userId: $userId) {
      id
      email
      is_verified
      created_at
      profile {
        first_name
        last_name
        avatar
      }
      department_name
      position_name
      role
      cvs {
        id
        created_at
      }
    }
  }
`) as TypedDocumentNode<{ user: any }, { userId: string }>;

type GetEmployeeResult = ResultOf<typeof GET_EMPLOYEE_QUERY>;

function toEmployeeProfile(user: NonNullable<GetEmployeeResult["user"]>): EmployeeProfile {
  const firstName = user.profile?.first_name ?? "";
  const lastName = user.profile?.last_name ?? "";
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";

  const parseDate = (d: string | null | undefined) => {
    if (!d) return undefined;
    try { return new Date(d).toDateString(); } catch { return undefined; }
  };

  return {
    id: Number(user.id),
    firstName,
    lastName,
    email: user.email ?? "",
    department: user.department_name ?? "Unassigned",
    position: user.position_name ?? "Unassigned",
    avatar: user.profile?.avatar ?? null,
    initials,
    isVerified: user.is_verified,
    memberSince: parseDate(user.created_at),
    role: user.role,
    cvs: user.cvs?.map((cv: any) => ({
      id: Number(cv.id),
      title: "CV",
      uploadedAt: parseDate(cv.created_at),
    })),
  };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = Number(id);
  if (isNaN(userId)) return {};

  const [result, t] = await Promise.all([
    gqlRequestAuthed(GET_EMPLOYEE_QUERY, { userId: String(userId) }),
    getTranslations("Users"),
  ]);

  if (!result.user) return {};

  const profile = result.user.profile;
  const firstName = profile?.first_name ?? "";
  const lastName = profile?.last_name ?? "";
  const name = `${firstName} ${lastName}`.trim() || result.user.email;

  return { title: name };
}

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = Number(id);
  if (isNaN(userId)) notFound();

  const [currentUser, { token, cookieHeader }] = await Promise.all([
    requireUser(),
    getAuthProps(),
  ]);

  const [result, departments, positions] = await Promise.all([
    gqlRequestAuthed(GET_EMPLOYEE_QUERY, { userId: String(userId) }, { token, cookieHeader }),
    getDepartments(),
    getPositions(),
  ]);

  if (!result.user) notFound();

  return (
    <UserProfileClient
      employee={toEmployeeProfile(result.user)}
      departments={departments}
      positions={positions}
      currentUserId={Number(currentUser.id)}
      currentUserRole={currentUser.role}
    />
  );
}
