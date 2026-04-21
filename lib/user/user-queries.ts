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
        skills {
          name
          categoryId
          mastery
        }
      }
    }
  }
`);

export const GET_USER_SKILLS = graphql(`
  query GetUserSkills($userId: ID!) {
    user(userId: $userId) {
      id
      profile {
        skills {
          name
          categoryId
          mastery
        }
      }
    }
  }
`);

export const DELETE_PROFILE_SKILL = graphql(`
  mutation DeleteProfileSkill($skill: DeleteProfileSkillInput!) {
    deleteProfileSkill(skill: $skill) {
      skills {
        name
        categoryId
        mastery
      }
    }
  }
`);

export const ADD_PROFILE_SKILL = graphql(`
  mutation AddProfileSkill($skill: AddProfileSkillInput!) {
    addProfileSkill(skill: $skill) {
      skills {
        name
        categoryId
        mastery
      }
    }
  }
`);

export const UPDATE_PROFILE_SKILL = graphql(`
  mutation UpdateProfileSkill($skill: UpdateProfileSkillInput!) {
    updateProfileSkill(skill: $skill) {
      skills {
        name
        categoryId
        mastery
      }
    }
  }
`);
