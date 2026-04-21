"use server";

import { revalidatePath } from "next/cache";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { getAuthProps } from "@/lib/auth/get-auth-props";
import { gqlRequestAuthed } from "@/lib/gql/graphql-client";
import { graphql } from "@/gqlcodegen";

type CreateCvResult = {
  createCv: {
    id: string;
    name: string;
    education: string | null;
    description: string;
  };
};

type CreateCvVars = {
  cv: {
    name: string;
    education: string;
    description: string;
  };
};

type UpdateCvResult = {
  updateCv: {
    id: string;
    name: string;
    education: string | null;
    description: string;
  };
};

type UpdateCvVars = {
  cv: {
    id: string;
    name: string;
    education: string;
    description: string;
  };
};

type DeleteCvResult = {
  deleteCv: {
    affected: number;
  };
};

type DeleteCvVars = {
  cv: {
    id: string;
  };
};

const CREATE_CV_MUTATION = graphql(`
  mutation CreateCV($cv: CreateCvInput!) {
    createCv(cv: $cv) {
      id
      name
      education
      description
    }
  }
`) as TypedDocumentNode<CreateCvResult, CreateCvVars>;

const UPDATE_CV_MUTATION = graphql(`
  mutation UpdateCV($cv: UpdateCvInput!) {
    updateCv(cv: $cv) {
      id
      name
      education
      description
    }
  }
`) as TypedDocumentNode<UpdateCvResult, UpdateCvVars>;

const DELETE_CV_MUTATION = graphql(`
  mutation DeleteCV($cv: DeleteCvInput!) {
    deleteCv(cv: $cv) {
      affected
    }
  }
`) as TypedDocumentNode<DeleteCvResult, DeleteCvVars>;

export async function createCVAction(cv: CreateCvVars["cv"]) {
  const { token, cookieHeader } = await getAuthProps();
  await gqlRequestAuthed(CREATE_CV_MUTATION, { cv }, { token, cookieHeader });
  revalidatePath("/cvs");
}

export async function updateCVAction(cv: UpdateCvVars["cv"]) {
  const { token, cookieHeader } = await getAuthProps();
  await gqlRequestAuthed(UPDATE_CV_MUTATION, { cv }, { token, cookieHeader });
  revalidatePath("/cvs");
}

export async function deleteCVAction(id: string) {
  const { token, cookieHeader } = await getAuthProps();
  await gqlRequestAuthed(DELETE_CV_MUTATION, { cv: { id } }, { token, cookieHeader });
  revalidatePath("/cvs");
}
