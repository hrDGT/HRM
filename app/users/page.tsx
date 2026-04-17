import { EmployeesClient } from "./_components/employees-client";
import { cookies } from "next/headers";
import { gqlRequest } from "@/lib/gql/graphql-client";
import { graphql } from "@/gqlcodegen";
import type { ResultOf, TypedDocumentNode } from "@graphql-typed-document-node/core";
import { EmployeeCard } from "@/lib/users/users-types";
import { getDepartments, getPositions } from "./[id]/actions";

const GET_EMPLOYEES_QUERY = graphql(`
  query GetEmployees {
    users {
      id
      email
      is_verified
      profile {
        first_name
        last_name
        avatar
      }
      department_name
      position_name
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

type GetEmployeesResult = ResultOf<typeof GET_EMPLOYEES_QUERY>;

function toEmployeeCard(user: GetEmployeesResult["users"][number]): EmployeeCard {
  const firstName = user.profile?.first_name ?? "";
  const lastName = user.profile?.last_name ?? "";
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";

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
  };
}

export default async function UsersPage() {
  const [result, departments, positions] = await Promise.all([
    gqlRequest(GET_EMPLOYEES_QUERY),
    getDepartments(),
    getPositions(),
  ]);

  const employees: EmployeeCard[] = result.users.map(toEmployeeCard);

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
console.log("UsersPage rendered");
  return (
    <EmployeesClient 
      employees={employees} 
      currentUserId={currentUserId} 
      currentUserRole={currentUserRole} 
      departments={departments}
      positions={positions}
    />
  );
}
