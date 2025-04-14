import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { gqlRequest } from "@/lib/gql/graphql-client";
import { graphql } from "@/gqlcodegen";
import type { ResultOf, TypedDocumentNode } from "@graphql-typed-document-node/core";
import { EmployeeProfile } from "@/lib/users/users-types";
import { UserProfileClient } from "./_components/user-profile-client";
import { getDepartments, getPositions } from "./actions";

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
`);

const GET_CURRENT_USER_ROLE = graphql(`
  query GetCurrentUserRole($userId: ID!) {
    user(userId: $userId) {
      role
    }
  }
`) as TypedDocumentNode<{ user: { role: string | null } | null }, { userId: string }>;

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
    cvs: user.cvs?.map((cv) => ({
      id: Number(cv.id),
      title: "CV",
      uploadedAt: parseDate(cv.created_at),
    })),
  };
}

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = Number(id);
  if (isNaN(userId)) notFound();

  const [result, departments, positions] = await Promise.all([
    gqlRequest(GET_EMPLOYEE_QUERY, { userId: String(userId) }),
    getDepartments(),
    getPositions(),
  ]);

  if (!result.user) notFound();

  const employee = toEmployeeProfile(result.user);

  const cookieStore = await cookies();
  const rawId = cookieStore.get("user_id")?.value;
  const currentUserId = rawId ? Number(rawId) : 0;

  let currentUserRole = "Employee";
  if (currentUserId > 0) {
    try {
      const roleRes = await gqlRequest(GET_CURRENT_USER_ROLE, { userId: String(currentUserId) });
      currentUserRole = roleRes.user?.role || "Employee";
    } catch {}
  }

  return (
    <UserProfileClient
      employee={employee}
      currentUserId={currentUserId}
      currentUserRole={currentUserRole}
      departments={departments}
      positions={positions}
    />
  );
}
