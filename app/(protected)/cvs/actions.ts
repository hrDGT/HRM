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
    createCv(cv: $cv) {
      id
      name
      education
      description
    }
  }
`) as TypedDocumentNode<CreateCvResult, CreateCvVars>;

const UPDATE_CV_MUTATION = gql(`
  mutation UpdateCV($cv: UpdateCvInput!) {
    updateCv(cv: $cv) {
      id
      name
      education
      description
    }
  }
`) as TypedDocumentNode<UpdateCvResult, UpdateCvVars>;

const DELETE_CV_MUTATION = gql(`
  mutation DeleteCV($cv: DeleteCvInput!) {
    deleteCv(cv: $cv) {
      affected
    }
  }
`) as TypedDocumentNode<DeleteCvResult, DeleteCvVars>;

const ADD_CV_SKILL_MUTATION = gql(`
  mutation AddCvSkill($skill: AddCvSkillInput!) {
    addCvSkill(skill: $skill) {
      id
    }
  }
`) as TypedDocumentNode<{ addCvSkill: { id: string } }, any>;

const UPDATE_CV_SKILL_MUTATION = gql(`
  mutation UpdateCvSkill($skill: UpdateCvSkillInput!) {
    updateCvSkill(skill: $skill) {
      id
    }
  }
`) as TypedDocumentNode<{ updateCvSkill: { id: string } }, any>;

const DELETE_CV_SKILL_MUTATION = gql(`
  mutation DeleteCvSkill($skill: DeleteCvSkillInput!) {
    deleteCvSkill(skill: $skill) {
      id
    }
  }
`) as TypedDocumentNode<{ deleteCvSkill: { id: string } }, any>;

type AddCvProjectResult = { addCvProject: { id: string } };
type AddCvProjectVars = { project: { cvId: string; name: string; domain: string; startDate: string; endDate?: string; description: string; environment?: string[]; responsibilities?: string[] } };

type UpdateCvProjectResult = { updateCvProject: { id: string } };
type UpdateCvProjectVars = { project: { id: string; name: string; domain: string; startDate: string; endDate?: string; description: string; environment?: string[]; responsibilities?: string[] } };

type RemoveCvProjectResult = { removeCvProject: { id: string } };
type RemoveCvProjectVars = { project: { id: string } };

const ADD_CV_PROJECT_MUTATION = gql(`
  mutation AddCvProject($project: AddCvProjectInput!) {
    addCvProject(project: $project) {
      id
    }
  }
`) as TypedDocumentNode<AddCvProjectResult, AddCvProjectVars>;

const UPDATE_CV_PROJECT_MUTATION = gql(`
  mutation UpdateCvProject($project: UpdateCvProjectInput!) {
    updateCvProject(project: $project) {
      id
    }
  }
`) as TypedDocumentNode<UpdateCvProjectResult, UpdateCvProjectVars>;

const REMOVE_CV_PROJECT_MUTATION = gql(`
  mutation RemoveCvProject($project: RemoveCvProjectInput!) {
    removeCvProject(project: $project) {
      id
    }
  }
`) as TypedDocumentNode<RemoveCvProjectResult, RemoveCvProjectVars>;

export async function createCVAction(userId: string, cv: Omit<CreateCvVars["cv"], "userId">) {
  await gqlRequestAuthed(CREATE_CV_MUTATION, { cv: { userId, ...cv } });
  revalidatePath("/cvs");
}

export async function updateCVAction(cv: { id: string; name: string; education: string; description: string }) {
  await gqlRequestAuthed(UPDATE_CV_MUTATION, {
    cv: {
      cvId: cv.id,
      name: cv.name,
      education: cv.education,
      description: cv.description,
    }
  });
  revalidatePath("/cvs");
}

export async function deleteCVAction(id: string) {
  await gqlRequestAuthed(DELETE_CV_MUTATION, { cv: { cvId: id } });
  revalidatePath("/cvs");
}

export async function updateCVDetailsAction(cvId: string, data: { name: string; education: string; description: string }) {
  await gqlRequestAuthed(UPDATE_CV_MUTATION, {
    cv: {
      cvId,
      name: data.name,
      education: data.education,
      description: data.description,
    }
  });
  revalidatePath(`/cvs/${cvId}`);
}

export async function getCVSkills(cvId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");

  const GET_CV_SKILLS_QUERY = gql(`
    query GetCVSkillsData($cvId: ID!) {
      cv(cvId: $cvId) {
        skills {
          name
          categoryId
          mastery
        }
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
      {
        categoryId: s.category?.id ?? null,
        categoryName: s.category?.name ?? null,
        categoryParentName: null,
      },
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
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");
 
  const data = await fetchSkills(token, cookieHeader);
  return (data ?? []).map((s) => ({ id: s.id, name: s.name }));
}
 
export async function addCVSkill(cvId: string, skillName: string, mastery: string) {
  await gqlRequestAuthed(ADD_CV_SKILL_MUTATION, { skill: { cvId, name: skillName, mastery } });
  revalidatePath(`/cvs/${cvId}`);
}

export async function updateCVSkill(cvId: string, skillName: string, mastery: string) {
  await gqlRequestAuthed(UPDATE_CV_SKILL_MUTATION, { skill: { cvId, name: skillName, mastery } });
  revalidatePath(`/cvs/${cvId}`);
}

export async function deleteCVSkills(cvId: string, skillNames: string[]) {
  await Promise.all(
    skillNames.map((name) =>
      gqlRequestAuthed(DELETE_CV_SKILL_MUTATION, { skill: { cvId, name } })
    )
  );
  revalidatePath(`/cvs/${cvId}`);
}

export async function addProjectAction(cvId: string, project: Omit<AddCvProjectVars["project"], "cvId">) {
  await gqlRequestAuthed(ADD_CV_PROJECT_MUTATION, { project: { cvId, ...project } });
  revalidatePath(`/cvs/${cvId}`);
}

export async function updateProjectAction(projectId: string, project: Omit<UpdateCvProjectVars["project"], "id">) {
  await gqlRequestAuthed(UPDATE_CV_PROJECT_MUTATION, { project: { id: projectId, ...project } });
  revalidatePath(`/cvs/${projectId}`);
}

export async function removeProjectAction(projectId: string) {
  await gqlRequestAuthed(REMOVE_CV_PROJECT_MUTATION, { project: { id: projectId } });
  revalidatePath(`/cvs/${projectId}`);
}
