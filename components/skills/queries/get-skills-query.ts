import { cacheLife, cacheTag } from 'next/cache';

import { gqlRequestAuthed } from '@/lib/gql/graphql-client';
import { graphql } from "@/gqlcodegen";

export const GET_SKILLS_QUERY = graphql(`
  query GetSkills {
    skills {
      id
      name
      category {
        id
        name
      }
    }
  }
`);

export async function fetchSkills(token?: string) {
  'use cache'
  cacheLife('hours')
  cacheTag('skills')
  cacheTag('skill-categories')

  const response = await gqlRequestAuthed(
    GET_SKILLS_QUERY,
    undefined,
    { token }
  )

  return response.skills
}