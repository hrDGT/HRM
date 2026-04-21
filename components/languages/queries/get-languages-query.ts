import { cacheLife, cacheTag } from 'next/cache';

import { gqlRequestAuthed } from '@/lib/gql/graphql-client';
import { graphql } from "@/gqlcodegen";

export const GET_LANGUAGES_QUERY = graphql(`
  query GetLanguages {
    languages {
      id
      iso2
      name
      native_name
    }
  }
`);

export async function fetchLanguages(token?: string) {
  'use cache';
  cacheLife('hours');
  cacheTag('languages');

  const response = await gqlRequestAuthed(
    GET_LANGUAGES_QUERY,
    undefined,
    { token }
  );

  return response.languages;
}