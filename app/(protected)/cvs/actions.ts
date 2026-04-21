"use server";

import { revalidatePath } from "next/cache";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { getAuthProps } from "@/lib/auth/get-auth-props";
import { gqlRequestAuthed } from "@/lib/gql/graphql-client";
import { graphql } from "@/gqlcodegen";

type CreateCvResult = { createCv: { id: string; name: string; education: string | null; description: string } };
type CreateCvVars = { cv: { name: string; education: string; description: string } };

type UpdateCvResult = { updateCv: { id: string; name: string; education: string | null; description: string } };
type UpdateCvVars = { cv: { id: string; name: string; education: string; description: string } };

type DeleteCvResult = { deleteCv: { affected: number } };
type DeleteCvVars = { cv: { id: string } };

type AddCvSkillResult = { addCvSkill: { id: string } };
type AddCvSkillVars = { skill: { cvId: string; name: string; categoryId?: string; mastery: string } };

type UpdateCvSkillResult = { updateCvSkill: { id: string } };
type UpdateCvSkillVars = { skill: { id: string; mastery: string } };

type DeleteCvSkillResult = { deleteCvSkill: { id: string } };
type DeleteCvSkillVars = { skill: { cvId: string; name: string } };

type AddCvProjectResult = { addCvProject: { id: string } };
type AddCvProjectVars = { project: { cvId: string; name: string; domain: string; startDate: string; endDate?: string; description: string; environment?: string[]; responsibilities?: string[] } };

type UpdateCvProjectResult = { updateCvProject: { id: string } };
type UpdateCvProjectVars = { project: { id: string; name: string; domain: string; startDate: string; endDate?: string; description: string; environment?: string[]; responsibilities?: string[] } };

type RemoveCvProjectResult = { removeCvProject: { id: string } };
type RemoveCvProjectVars = { project: { id: string } };

const CREATE_CV_MUTATION = graphql(`
  mutation CreateCV($cv: CreateCvInput!) { createCv(cv: $cv) { id name education description } }
`) as TypedDocumentNode<CreateCvResult, CreateCvVars>;

const UPDATE_CV_MUTATION = graphql(`
  mutation UpdateCV($cv: UpdateCvInput!) { updateCv(cv: $cv) { id name education description } }
`) as TypedDocumentNode<UpdateCvResult, UpdateCvVars>;

const DELETE_CV_MUTATION = graphql(`
  mutation DeleteCV($cv: DeleteCvInput!) { deleteCv(cv: $cv) { affected } }
`) as TypedDocumentNode<DeleteCvResult, DeleteCvVars>;

const ADD_CV_SKILL_MUTATION = graphql(`
  mutation AddCvSkill($skill: AddCvSkillInput!) { addCvSkill(skill: $skill) { id } }
`) as TypedDocumentNode<AddCvSkillResult, AddCvSkillVars>;

const UPDATE_CV_SKILL_MUTATION = graphql(`
  mutation UpdateCvSkill($skill: UpdateCvSkillInput!) { updateCvSkill(skill: $skill) { id } }
`) as TypedDocumentNode<UpdateCvSkillResult, UpdateCvSkillVars>;

const DELETE_CV_SKILL_MUTATION = graphql(`
  mutation DeleteCvSkill($skill: DeleteCvSkillInput!) { deleteCvSkill(skill: $skill) { id } }
`) as TypedDocumentNode<DeleteCvSkillResult, DeleteCvSkillVars>;

const ADD_CV_PROJECT_MUTATION = graphql(`
  mutation AddCvProject($project: AddCvProjectInput!) { addCvProject(project: $project) { id } }
`) as TypedDocumentNode<AddCvProjectResult, AddCvProjectVars>;

const UPDATE_CV_PROJECT_MUTATION = graphql(`
  mutation UpdateCvProject($project: UpdateCvProjectInput!) { updateCvProject(project: $project) { id } }
`) as TypedDocumentNode<UpdateCvProjectResult, UpdateCvProjectVars>;

const REMOVE_CV_PROJECT_MUTATION = graphql(`
  mutation RemoveCvProject($project: RemoveCvProjectInput!) { removeCvProject(project: $project) { id } }
`) as TypedDocumentNode<RemoveCvProjectResult, RemoveCvProjectVars>;

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

export async function updateCVDetailsAction(cvId: string, data: { name: string; education: string; description: string }) {
  const { token, cookieHeader } = await getAuthProps();
  await gqlRequestAuthed(UPDATE_CV_MUTATION, { cv: { id: cvId, ...data } }, { token, cookieHeader });
  revalidatePath(`/cvs/${cvId}`);
}

export async function addSkillAction(cvId: string, name: string, categoryId: string | undefined, mastery: string) {
  const { token, cookieHeader } = await getAuthProps();
  await gqlRequestAuthed(ADD_CV_SKILL_MUTATION, { skill: { cvId, name, categoryId, mastery } }, { token, cookieHeader });
  revalidatePath(`/cvs/${cvId}`);
}

export async function updateSkillAction(id: string, mastery: string) {
  const { token, cookieHeader } = await getAuthProps();
  await gqlRequestAuthed(UPDATE_CV_SKILL_MUTATION, { skill: { id, mastery } }, { token, cookieHeader });
  revalidatePath(`/cvs/${id}`);
}

export async function removeSkillAction(cvId: string, name: string) {
  const { token, cookieHeader } = await getAuthProps();
  await gqlRequestAuthed(DELETE_CV_SKILL_MUTATION, { skill: { cvId, name } }, { token, cookieHeader });
  revalidatePath(`/cvs/${cvId}`);
}

export async function addProjectAction(cvId: string, project: Omit<AddCvProjectVars["project"], "cvId">) {
  const { token, cookieHeader } = await getAuthProps();
  await gqlRequestAuthed(ADD_CV_PROJECT_MUTATION, { project: { cvId, ...project } }, { token, cookieHeader });
  revalidatePath(`/cvs/${cvId}`);
}

export async function updateProjectAction(projectId: string, project: Omit<UpdateCvProjectVars["project"], "id">) {
  const { token, cookieHeader } = await getAuthProps();
  await gqlRequestAuthed(UPDATE_CV_PROJECT_MUTATION, { project: { id: projectId, ...project } }, { token, cookieHeader });
  revalidatePath(`/cvs/${projectId}`);
}

export async function removeProjectAction(projectId: string) {
  const { token, cookieHeader } = await getAuthProps();
  await gqlRequestAuthed(REMOVE_CV_PROJECT_MUTATION, { project: { id: projectId } }, { token, cookieHeader });
  revalidatePath(`/cvs/${projectId}`);
}
