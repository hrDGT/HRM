import { cacheLife, cacheTag } from 'next/cache';

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

export async function fetchDepartments(token?: string, cookieHeader?: string) {
  'use cache';
  cacheLife('hours');
  cacheTag('departments');

  const response = await gqlRequestAuthed(
    GET_DEPARTMENTS_QUERY,
    undefined,
    { token, cookieHeader }
  );

  return response.departments;
}
