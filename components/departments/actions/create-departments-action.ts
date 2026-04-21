"use server";

import { updateTag } from "next/cache";
import { getTranslations } from "next-intl/server";

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
  const t = await getTranslations("Departments.toasts");
  try {
    await gqlRequestAuthed(CREATE_DEPARTMENT_MUTATION, {
      department: { name }
    });
    updateTag("departments");

    return { success: true };
  } catch (err) {
    return { error: getError(err, t("createError")) };
  }
}