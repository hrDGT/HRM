import { gqlRequestAuthed } from '@/lib/gql/graphql-client';
import { graphql } from "@/gqlcodegen";

export const GET_DEPARTMENTS_QUERY = graphql(`
  query GetDepartments {
    departments {
      id
      name
    }
  }
`);

export async function fetchDepartments() {
  const response = await gqlRequestAuthed(
    GET_DEPARTMENTS_QUERY,
    undefined,
    {
      next: { revalidate: 0 },
    }
  );

  return response.departments;
}