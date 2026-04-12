"use server";

import { revalidatePath } from "next/cache";

import { gqlRequestAuthed } from '@/lib/gql/graphql-client';
import { getError } from "@/lib/utils";
import { graphql } from "@/gqlcodegen";

const CREATE_DEPARTMENT_MUTATION = graphql(`
  mutation CreateDepartment($department: CreateDepartmentInput!) {
    createDepartment(department: $department) {
      id,
      name
    }
  }
`);

export async function createDepartmentAction(name: string) {
  try {
    await gqlRequestAuthed(CREATE_DEPARTMENT_MUTATION, {
      department: { name }
    });
    revalidatePath("/departments");

    return { success: true };
  } catch (err) {
    return { error: getError(err, "Failed to create department") };
  }
}