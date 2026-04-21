import { cacheLife, cacheTag } from 'next/cache';

import { gqlRequestAuthed } from '@/lib/gql/graphql-client';
import { graphql } from "@/gqlcodegen";

export const GET_SKILL_CATEGORIES_QUERY = graphql(`
  query GetSkillCategories {
    skillCategories {
      id
      name
      order
    }
  }
`);

export async function fetchSkillsCategories(token?: string, cookieHeader?: string) {
  'use cache'
  cacheLife('hours')
  cacheTag('skill-categories')

  const response = await gqlRequestAuthed(
    GET_SKILL_CATEGORIES_QUERY,
    undefined,
    { token, cookieHeader },
  )
  return response.skillCategories
}
