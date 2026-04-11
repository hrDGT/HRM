import { gqlRequestAuthed } from "@/lib/gql/graphql-client";
import { graphql } from "@/gqlcodegen";

export const GET_DEPARTMENTS = graphql(`
  query GetDepartments {
    departments {
      id
      name
    }
  }
`);

export async function fetchDepartments() {
  const response = await gqlRequestAuthed(
    GET_DEPARTMENTS,
    undefined,
    {
      cache: "no-store",
    }
  );

  return response.departments;
}