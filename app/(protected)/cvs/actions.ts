"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { gqlRequestAuthed } from "@/lib/gql/graphql-client";
import { gql } from "graphql-tag";
import { fetchSkills } from "@/components/skills/queries/get-skills-query";
import type { MasteryLevel } from "@/lib/users/skill-utils";

type CreateCvResult = { createCv: { id: string; name: string; education: string | null; description: string } };
type CreateCvVars = { cv: { userId: string; name: string; education: string; description: string } };

type UpdateCvResult = { updateCv: { id: string; name: string; education: string | null; description: string } };
type UpdateCvVars = { cv: { cvId: string; name: string; education: string; description: string } };

type DeleteCvResult = { deleteCv: { affected: number } };
type DeleteCvVars = { cv: { cvId: string } };

const CREATE_CV_MUTATION = gql(`
  mutation CreateCV($cv: CreateCvInput!) {
    createCv(cv: $cv) { id name education description }
  }
`) as TypedDocumentNode<CreateCvResult, CreateCvVars>;

const UPDATE_CV_MUTATION = gql(`
  mutation UpdateCV($cv: UpdateCvInput!) {
    updateCv(cv: $cv) { id name education description }
  }
`) as TypedDocumentNode<UpdateCvResult, UpdateCvVars>;

const DELETE_CV_MUTATION = gql(`
  mutation DeleteCV($cv: DeleteCvInput!) {
    deleteCv(cv: $cv) { affected }
  }
`) as TypedDocumentNode<DeleteCvResult, DeleteCvVars>;

const ADD_CV_SKILL_MUTATION = gql(`
  mutation AddCvSkill($skill: AddCvSkillInput!) {
    addCvSkill(skill: $skill) { id }
  }
`) as TypedDocumentNode<{ addCvSkill: { id: string } }, any>;

const UPDATE_CV_SKILL_MUTATION = gql(`
  mutation UpdateCvSkill($skill: UpdateCvSkillInput!) {
    updateCvSkill(skill: $skill) { id }
  }
`) as TypedDocumentNode<{ updateCvSkill: { id: string } }, any>;

const DELETE_CV_SKILL_MUTATION = gql(`
  mutation DeleteCvSkill($skill: DeleteCvSkillInput!) {
    deleteCvSkill(skill: $skill) { id }
  }
`) as TypedDocumentNode<{ deleteCvSkill: { id: string } }, any>;

export type AvailableProject = {
  id: string;
  name: string;
  internal_name: string;
  domain: string;
  description: string;
  environment: string[];
};

type AddCvProjectVars = {
  project: {
    cvId: string;
    projectId: string;
    start_date: string;
    end_date?: string | null;
    roles: string[];
    responsibilities: string[];
  };
};

type UpdateCvProjectVars = {
  project: {
    cvId: string;
    projectId: string;
    start_date: string;
    end_date?: string | null;
    roles: string[];
    responsibilities: string[];
  };
};

type RemoveCvProjectVars = { project: { cvId: string; projectId: string } };

const GET_AVAILABLE_PROJECTS_QUERY = gql(`
  query GetProjects {
    projects {
      id
      name
      internal_name
      domain
      description
      environment
    }
  }
`) as TypedDocumentNode<{ projects: AvailableProject[] }, Record<string, never>>;

const ADD_CV_PROJECT_MUTATION = gql(`
  mutation AddCvProject($project: AddCvProjectInput!) {
    addCvProject(project: $project) { id }
  }
`) as TypedDocumentNode<{ addCvProject: { id: string } }, AddCvProjectVars>;

const UPDATE_CV_PROJECT_MUTATION = gql(`
  mutation UpdateCvProject($project: UpdateCvProjectInput!) {
    updateCvProject(project: $project) { id }
  }
`) as TypedDocumentNode<{ updateCvProject: { id: string } }, UpdateCvProjectVars>;

const REMOVE_CV_PROJECT_MUTATION = gql(`
  mutation RemoveCvProject($project: RemoveCvProjectInput!) {
    removeCvProject(project: $project) { id }
  }
`) as TypedDocumentNode<{ removeCvProject: { id: string } }, RemoveCvProjectVars>;

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");
  return { token, cookieHeader };
}

export async function createCVAction(userId: string, cv: Omit<CreateCvVars["cv"], "userId">) {
  const { token, cookieHeader } = await getAuthHeaders();
  await gqlRequestAuthed(CREATE_CV_MUTATION, { cv: { userId, ...cv } }, { token, cookieHeader });
  revalidatePath("/cvs");
}

export async function updateCVAction(cv: { id: string; name: string; education: string; description: string }) {
  const { token, cookieHeader } = await getAuthHeaders();
  await gqlRequestAuthed(UPDATE_CV_MUTATION, {
    cv: { cvId: cv.id, name: cv.name, education: cv.education, description: cv.description },
  }, { token, cookieHeader });
  revalidatePath("/cvs");
}

export async function deleteCVAction(id: string) {
  const { token, cookieHeader } = await getAuthHeaders();
  await gqlRequestAuthed(DELETE_CV_MUTATION, { cv: { cvId: id } }, { token, cookieHeader });
  revalidatePath("/cvs");
}

export async function updateCVDetailsAction(cvId: string, data: { name: string; education: string; description: string }) {
  const { token, cookieHeader } = await getAuthHeaders();
  await gqlRequestAuthed(UPDATE_CV_MUTATION, {
    cv: { cvId, name: data.name, education: data.education, description: data.description },
  }, { token, cookieHeader });
  revalidatePath(`/cvs/${cvId}`);
}

export async function getCVSkills(cvId: string) {
  const { token, cookieHeader } = await getAuthHeaders();

  const GET_CV_SKILLS_QUERY = gql(`
    query GetCVSkillsData($cvId: ID!) {
      cv(cvId: $cvId) {
        skills { name categoryId mastery }
      }
    }
  `) as TypedDocumentNode<
    { cv: { skills: Array<{ name: string; categoryId?: string | null; mastery: string }> } },
    { cvId: string }
  >;

  const [skillsData, allSkills] = await Promise.all([
    gqlRequestAuthed(GET_CV_SKILLS_QUERY, { cvId }, { token, cookieHeader }),
    fetchSkills(token, cookieHeader),
  ]);

  const skillMetaMap = new Map(
    (allSkills ?? []).map((s) => [
      s.name,
      { categoryId: s.category?.id ?? null, categoryName: s.category?.name ?? null, categoryParentName: null },
    ])
  );

  return (skillsData.cv?.skills ?? []).map((s) => {
    const meta = skillMetaMap.get(s.name);
    return {
      name: s.name,
      categoryId: meta?.categoryId ?? s.categoryId ?? null,
      categoryName: meta?.categoryName ?? null,
      categoryParentName: meta?.categoryParentName ?? null,
      mastery: s.mastery as MasteryLevel,
    };
  });
}

export async function getAvailableSkills() {
  const { token, cookieHeader } = await getAuthHeaders();
  const data = await fetchSkills(token, cookieHeader);
  return (data ?? []).map((s) => ({ id: s.id, name: s.name }));
}

export async function addCVSkill(cvId: string, skillName: string, mastery: string) {
  const { token, cookieHeader } = await getAuthHeaders();
  await gqlRequestAuthed(ADD_CV_SKILL_MUTATION, { skill: { cvId, name: skillName, mastery } }, { token, cookieHeader });
  revalidatePath(`/cvs/${cvId}`);
}

export async function updateCVSkill(cvId: string, skillName: string, mastery: string) {
  const { token, cookieHeader } = await getAuthHeaders();
  await gqlRequestAuthed(UPDATE_CV_SKILL_MUTATION, { skill: { cvId, name: skillName, mastery } }, { token, cookieHeader });
  revalidatePath(`/cvs/${cvId}`);
}

export async function deleteCVSkills(cvId: string, skillNames: string[]) {
  const { token, cookieHeader } = await getAuthHeaders();
  await Promise.all(skillNames.map((name) => gqlRequestAuthed(DELETE_CV_SKILL_MUTATION, { skill: { cvId, name } }, { token, cookieHeader })));
  revalidatePath(`/cvs/${cvId}`);
}

export async function getAvailableProjects(): Promise<AvailableProject[]> {
  const { token, cookieHeader } = await getAuthHeaders();
  const data = await gqlRequestAuthed(GET_AVAILABLE_PROJECTS_QUERY, {}, { token, cookieHeader });
  return data.projects ?? [];
}

export async function addProjectAction(
  cvId: string,
  payload: { 
    projectId: string; 
    start_date: string; 
    end_date?: string | null; 
    roles?: string[]; 
    responsibilities?: string[] 
  }
) {
  const { token, cookieHeader } = await getAuthHeaders();
  await gqlRequestAuthed(ADD_CV_PROJECT_MUTATION, { 
    project: { 
      cvId, 
      projectId: payload.projectId,
      start_date: payload.start_date,
      end_date: payload.end_date ?? undefined,
      roles: payload.roles ?? [],
      responsibilities: payload.responsibilities ?? [],
    } 
  }, { token, cookieHeader });
  revalidatePath(`/cvs/${cvId}`);
}

export async function updateProjectAction(
  cvId: string,
  projectId: string,
  payload: { 
    start_date: string; 
    end_date?: string | null; 
    roles?: string[]; 
    responsibilities?: string[] 
  }
) {
  const { token, cookieHeader } = await getAuthHeaders();
  const projectInput: any = { 
    cvId,
    projectId,
    start_date: payload.start_date,
    roles: payload.roles ?? [],
    responsibilities: payload.responsibilities ?? [],
  };
  
  if (payload.end_date) {
    projectInput.end_date = payload.end_date;
  }

  await gqlRequestAuthed(UPDATE_CV_PROJECT_MUTATION, { 
    project: projectInput
  }, { token, cookieHeader });
  revalidatePath(`/cvs/${cvId}`);
}

export async function removeProjectAction(projectId: string, cvId: string) {
  const { token, cookieHeader } = await getAuthHeaders();
  await gqlRequestAuthed(REMOVE_CV_PROJECT_MUTATION, { 
    project: { 
      cvId,
      projectId,
    } 
  }, { token, cookieHeader });
  revalidatePath(`/cvs/${cvId}`);
}
