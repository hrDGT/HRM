import { cacheLife, cacheTag } from 'next/cache';

import { gqlRequestAuthed } from '@/lib/gql/graphql-client';
import { graphql } from "@/gqlcodegen";

export const GET_POSITIONS_QUERY = graphql(`
  query GetPositions {
    positions {
      id
      name
    }
  }
`);

export async function fetchPositions(token?: string, cookieHeader?: string) {
  'use cache'
  cacheLife('hours')
  cacheTag('positions')

  const response = await gqlRequestAuthed(
    GET_POSITIONS_QUERY,
    undefined,
    { token, cookieHeader }
  )

  return response.positions
}
