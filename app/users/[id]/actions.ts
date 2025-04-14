"use server";

import { gqlRequest } from "@/lib/gql/graphql-client";
import { gql } from "graphql-tag";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";

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
  profile: {
    userId: string;
    first_name: string;
    last_name: string;
  };
};

type UpdateUserResult = {
  updateUser: {
    id: string;
    department_name: string | null;
    position_name: string | null;
  };
};

type UpdateUserVariables = {
  user: Record<string, any>;
};

type UploadAvatarResult = {
  uploadAvatar: string;
};

type UploadAvatarVariables = {
  avatar: {
    userId: string;
    base64: string;
    size: number;
    type: string;
  };
};

type GetDepartmentsResult = {
  departments: { id: string; name: string }[];
};

type GetPositionsResult = {
  positions: { id: string; name: string }[];
};


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

const GET_DEPARTMENTS = gql`
  query GetDepartments {
    departments {
      id
      name
    }
  }
` as TypedDocumentNode<GetDepartmentsResult, {}>;

const GET_POSITIONS = gql`
  query GetPositions {
    positions {
      id
      name
    }
  }
` as TypedDocumentNode<GetPositionsResult, {}>;

export async function getDepartments() {
  const result = await gqlRequest(GET_DEPARTMENTS, {});
  return result.departments;
}

export async function getPositions() {
  const result = await gqlRequest(GET_POSITIONS, {});
  return result.positions;
}

export async function updateProfile(userId: number, firstName: string, lastName: string) {
  const result = await gqlRequest(UPDATE_PROFILE_MUTATION, {
    profile: {
      userId: String(userId),
      first_name: firstName,
      last_name: lastName,
    },
  });
  return result.updateProfile;
}

export async function updateUserMeta(userId: number, departmentId: number | null | undefined, positionId: number | null | undefined) {
  if (departmentId == null && positionId == null) {
    return null;
  }

  const payload: Record<string, any> = { userId: String(userId) };
  if (departmentId != null) payload.departmentId = String(departmentId);
  if (positionId != null) payload.positionId = String(positionId);

  const result = await gqlRequest(UPDATE_USER_MUTATION, { user: payload });
  return result.updateUser;
}

export async function uploadAvatar(userId: number, base64: string, size: number, type: string) {
  const result = await gqlRequest(UPLOAD_AVATAR_MUTATION, {
    avatar: {
      userId: String(userId),
      base64,
      size,
      type,
    },
  });
  return result.uploadAvatar;
}
