import { getTranslations } from "next-intl/server";
import type { ResultOf } from "@graphql-typed-document-node/core";

import { getAuthProps } from "@/lib/auth/get-auth-props";
import { requireUser } from "@/lib/auth/require-user";
import { gqlRequestAuthed } from "@/lib/gql/graphql-client";
import { EmployeeCard } from "@/lib/users/users-types";
import { graphql } from "@/gqlcodegen";

import { EmployeesClient } from "./_components/employees-client";
import { getDepartments, getPositions } from "./actions";

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

type GetEmployeesResult = ResultOf<typeof GET_EMPLOYEES_QUERY>;

function toEmployeeCard(
  user: GetEmployeesResult["users"][number],
): EmployeeCard {
  const firstName = user.profile?.first_name ?? "";
  const lastName = user.profile?.last_name ?? "";
  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";

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

export async function generateMetadata() {
  const t = await getTranslations("Users");
  return { title: t("title") };
}

export default async function UsersPage() {
  const [currentUser, { token, cookieHeader }] = await Promise.all([
    requireUser(),
    getAuthProps(),
  ]);

  const [result, departments, positions] = await Promise.all([
    gqlRequestAuthed(GET_EMPLOYEES_QUERY, undefined, { token, cookieHeader }),
    getDepartments(),
    getPositions(),
  ]);

  return (
    <EmployeesClient
      employees={result.users.map(toEmployeeCard)}
      departments={departments}
      positions={positions}
      currentUserId={String(currentUser.id)}
      currentUserRole={currentUser.role}
    />
  );
}
