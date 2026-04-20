"use server";

import { revalidateTag } from "next/cache";
import { gql } from "graphql-tag";
import { gqlRequestAuthed } from "@/lib/gql/graphql-client";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { UserRole } from "@/gqlcodegen/graphql";

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
