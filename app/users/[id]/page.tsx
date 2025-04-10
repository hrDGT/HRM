import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { gqlRequest } from "@/lib/gql/graphql-client";
import { graphql } from "@/gqlcodegen";
import type { ResultOf } from "@graphql-typed-document-node/core";
import { EmployeeProfile } from "@/lib/users/users-types";
import { UserProfileClient } from "./_components/user-profile-client";

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

  const result = await gqlRequest(GET_EMPLOYEE_QUERY, { userId: String(userId) });
  if (!result.user) notFound();

  const employee = toEmployeeProfile(result.user);

  const cookieStore = await cookies();
  const rawId = cookieStore.get("user_id")?.value;
  const currentUserId = rawId ? Number(rawId) : 0;

  return <UserProfileClient employee={employee} currentUserId={currentUserId} />;
}
