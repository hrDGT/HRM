"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { gql } from "graphql-tag";
import { gqlRequestAuthed } from "@/lib/gql/graphql-client";
import { GET_USER_SKILLS, ADD_PROFILE_SKILL, UPDATE_PROFILE_SKILL, DELETE_PROFILE_SKILL } from "@/lib/user/user-queries";
import { fetchSkills } from "@/components/skills/queries/get-skills-query";
import type { MasteryLevel } from "@/lib/users/skill-utils";
import type { ProficiencyLevel } from "@/lib/users/language-utils";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { UserRole } from "@/gqlcodegen/graphql";
import { Mastery } from "@/gqlcodegen/graphql";

type CreateUserInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  departmentId?: string;
  positionId?: string;
  role: UserRole;
};

type CreateUserResult = {
  createUser: {
    id: string;
    email: string;
    profile: { first_name: string; last_name: string; avatar: string | null };
    department_name: string | null;
    position_name: string | null;
    role: UserRole;
    is_verified: boolean;
  };
};
type CreateUserVariables = {
  user: {
    auth: { email: string; password: string };
    profile: { first_name: string; last_name: string };
    departmentId?: string;
    positionId?: string;
    role: UserRole;
  };
};

type UpdateProfileResult = {
  updateProfile: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    full_name: string | null;
    avatar: string | null;
  };
};
type UpdateProfileVariables = {
  profile: { userId: string; first_name: string; last_name: string };
};

type UpdateUserResult = {
  updateUser: { id: string; department_name: string | null; position_name: string | null };
};
type UpdateUserVariables = { user: Record<string, string> };

type UploadAvatarResult = { uploadAvatar: string };
type UploadAvatarVariables = {
  avatar: { userId: string; base64: string; size: number; type: string };
};

type DeleteAvatarResult = { deleteAvatar: null };
type DeleteAvatarVariables = { avatar: { userId: string } };

type GetDepartmentsResult = { departments: { id: string; name: string }[] };
type GetPositionsResult = { positions: { id: string; name: string }[] };

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($user: CreateUserInput!) {
    createUser(user: $user) {
      id
      email
      profile { first_name last_name avatar }
      department_name
      position_name
      role
      is_verified
    }
  }
` as TypedDocumentNode<CreateUserResult, CreateUserVariables>;

const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($profile: UpdateProfileInput!) {
    updateProfile(profile: $profile) {
      id
      first_name
      last_name
      full_name
      avatar
    }
  }
` as TypedDocumentNode<UpdateProfileResult, UpdateProfileVariables>;

const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($user: UpdateUserInput!) {
    updateUser(user: $user) {
      id
      department_name
      position_name
    }
  }
` as TypedDocumentNode<UpdateUserResult, UpdateUserVariables>;

const UPLOAD_AVATAR_MUTATION = gql`
  mutation UploadAvatar($avatar: UploadAvatarInput!) {
    uploadAvatar(avatar: $avatar)
  }
` as TypedDocumentNode<UploadAvatarResult, UploadAvatarVariables>;

const DELETE_AVATAR_MUTATION = gql`
  mutation DeleteAvatar($avatar: DeleteAvatarInput!) {
    deleteAvatar(avatar: $avatar)
  }
` as TypedDocumentNode<DeleteAvatarResult, DeleteAvatarVariables>;

const GET_DEPARTMENTS = gql`
  query GetDepartments {
    departments {
      id
      name
    }
  }
` as TypedDocumentNode<GetDepartmentsResult, Record<string, never>>;

const GET_POSITIONS = gql`
  query GetPositions {
    positions {
      id
      name
    }
  }
` as TypedDocumentNode<GetPositionsResult, Record<string, never>>;

export async function createUser(data: CreateUserInput) {
  const result = await gqlRequestAuthed(CREATE_USER_MUTATION, {
    user: {
      auth: {
        email: data.email,
        password: data.password,
      },
      profile: {
        first_name: data.firstName,
        last_name: data.lastName,
      },
      cvsIds: [],
      departmentId: data.departmentId,
      positionId: data.positionId,
      role: data.role,
    },
  });
  revalidateTag("users", "default");
  return result.createUser;
}

export async function getDepartments() {
  const result = await gqlRequestAuthed(GET_DEPARTMENTS, {});
  return result.departments;
}

export async function getPositions() {
  const result = await gqlRequestAuthed(GET_POSITIONS, {});
  return result.positions;
}

export async function updateProfile(userId: number, firstName: string, lastName: string) {
  const result = await gqlRequestAuthed(UPDATE_PROFILE_MUTATION, {
    profile: { userId: String(userId), first_name: firstName, last_name: lastName },
  });
  revalidateTag("users", "default");
  return result.updateProfile;
}

export async function updateUserMeta(
  userId: number,
  departmentId: number | null | undefined,
  positionId: number | null | undefined
) {
  if (departmentId == null && positionId == null) return null;

  const payload: Record<string, string> = { userId: String(userId) };
  if (departmentId != null) payload.departmentId = String(departmentId);
  if (positionId != null) payload.positionId = String(positionId);

  const result = await gqlRequestAuthed(UPDATE_USER_MUTATION, { user: payload });
  revalidateTag("users", "default");
  return result.updateUser;
}

export async function uploadAvatar(userId: number, base64: string, size: number, type: string) {
  const result = await gqlRequestAuthed(UPLOAD_AVATAR_MUTATION, {
    avatar: { userId: String(userId), base64, size, type },
  });
  revalidateTag("users", "default");
  return result.uploadAvatar;
}

export async function deleteAvatar(userId: number) {
  const result = await gqlRequestAuthed(DELETE_AVATAR_MUTATION, {
    avatar: { userId: String(userId) },
  });
  revalidateTag("users", "default");
  return result.deleteAvatar;
}

export async function getUserSkills(userId: number) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");

  const [skillsData, allSkills] = await Promise.all([
    gqlRequestAuthed(GET_USER_SKILLS, { userId: String(userId) }, { token, cookieHeader }),
    fetchSkills(token, cookieHeader),
  ]);

  const skillMetaMap = new Map(
    (allSkills ?? []).map((s) => [
      s.name,
      {
        categoryId: s.category?.id ?? null,
        categoryName: s.category?.name ?? null,
      },
    ])
  );

  return (skillsData.user?.profile?.skills ?? []).map((s) => {
    const meta = skillMetaMap.get(s.name);
    return {
      name: s.name,
      categoryId: meta?.categoryId ?? s.categoryId ?? null,
      categoryName: meta?.categoryName ?? null,
      categoryParentName: null,
      mastery: s.mastery as MasteryLevel,
    };
  });
}


export async function deleteProfileSkills(userId: number, skillNames: string[]) {
  const data = await gqlRequestAuthed(DELETE_PROFILE_SKILL, {
    skill: {
      userId: String(userId),
      name: skillNames,
    },
  });
  return (data.deleteProfileSkill?.skills ?? []).map((s) => ({
    name: s.name,
    categoryId: s.categoryId ?? null,
    mastery: s.mastery as MasteryLevel,
  }));
}

export async function getAvailableSkills() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");
 
  const data = await fetchSkills(token, cookieHeader);
  return (data ?? []).map((s) => ({ id: s.id, name: s.name }));
}
 
export async function addProfileSkill(userId: number, skillName: string, mastery: MasteryLevel) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");
 
  await gqlRequestAuthed(
    ADD_PROFILE_SKILL,
    { skill: { userId: String(userId), name: skillName, mastery: mastery as unknown as Mastery } },
    { token, cookieHeader }
  );
}
 
export async function updateProfileSkill(userId: number, skillName: string, mastery: MasteryLevel) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");
 
  await gqlRequestAuthed(
    UPDATE_PROFILE_SKILL,
    { skill: { userId: String(userId), name: skillName, mastery: mastery as unknown as Mastery } },
    { token, cookieHeader }
  );
}

export async function getUserLanguages(userId: number) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");

  const GET_USER_LANGUAGES = gql`
    query GetUserLanguages($userId: ID!) {
      user(userId: $userId) {
        profile {
          languages {
            name
            proficiency
          }
        }
      }
    }
  ` as TypedDocumentNode<{ user: { profile: { languages: Array<{ name: string; proficiency: string }> } } }, { userId: string }>;

  const data = await gqlRequestAuthed(GET_USER_LANGUAGES, { userId: String(userId) }, { token, cookieHeader });

  return (data.user?.profile?.languages ?? []).map((l) => ({
    name: l.name,
    proficiency: l.proficiency as ProficiencyLevel,
  }));
}

export async function deleteProfileLanguages(userId: number, languageNames: string[]) {
  const DELETE_PROFILE_LANGUAGE = gql`
    mutation DeleteProfileLanguage($language: DeleteProfileLanguageInput!) {
      deleteProfileLanguage(language: $language) {
        languages {
          name
          proficiency
        }
      }
    }
  ` as TypedDocumentNode<{ deleteProfileLanguage: { languages: Array<{ name: string; proficiency: string }> } }, { language: { userId: string; name: string[] } }>;

  const data = await gqlRequestAuthed(DELETE_PROFILE_LANGUAGE, {
    language: {
      userId: String(userId),
      name: languageNames,
    },
  });
  return (data.deleteProfileLanguage?.languages ?? []).map((l) => ({
    name: l.name,
    proficiency: l.proficiency as ProficiencyLevel,
  }));
}

export async function getAvailableLanguages() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");

  const GET_AVAILABLE_LANGUAGES = gql`
    query GetAvailableLanguages {
      languages {
        id
        name
      }
    }
  ` as TypedDocumentNode<{ languages: Array<{ id: string; name: string }> }, Record<string, never>>;

  const data = await gqlRequestAuthed(GET_AVAILABLE_LANGUAGES, {}, { token, cookieHeader });
  return (data.languages ?? []).map((l) => ({ id: l.id, name: l.name }));
}

export async function addProfileLanguage(userId: number, languageName: string, proficiency: ProficiencyLevel) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");

  const ADD_PROFILE_LANGUAGE = gql`
    mutation AddProfileLanguage($language: AddProfileLanguageInput!) {
      addProfileLanguage(language: $language) {
        languages {
          name
          proficiency
        }
      }
    }
  ` as TypedDocumentNode<{ addProfileLanguage: { languages: Array<{ name: string; proficiency: string }> } }, { language: { userId: string; name: string; proficiency: string } }>;

  await gqlRequestAuthed(
    ADD_PROFILE_LANGUAGE,
    { language: { userId: String(userId), name: languageName, proficiency: proficiency as unknown as string } },
    { token, cookieHeader }
  );
}

export async function updateProfileLanguage(userId: number, languageName: string, proficiency: ProficiencyLevel) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");

  const UPDATE_PROFILE_LANGUAGE = gql`
    mutation UpdateProfileLanguage($language: UpdateProfileLanguageInput!) {
      updateProfileLanguage(language: $language) {
        languages {
          name
          proficiency
        }
      }
    }
  ` as TypedDocumentNode<{ updateProfileLanguage: { languages: Array<{ name: string; proficiency: string }> } }, { language: { userId: string; name: string; proficiency: string } }>;

  await gqlRequestAuthed(
    UPDATE_PROFILE_LANGUAGE,
    { language: { userId: String(userId), name: languageName, proficiency: proficiency as unknown as string } },
    { token, cookieHeader }
  );
}
