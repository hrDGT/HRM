import { graphql } from "@/gqlcodegen";

export const GET_USER_FOR_STORE = graphql(`
  query GetUserForStore($userId: ID!) {
    user(userId: $userId) {
      id
      email
      role
      profile {
        first_name
        last_name
        avatar
      }
    }
  }
`);