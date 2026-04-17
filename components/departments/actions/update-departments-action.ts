"use server";

import { updateTag } from "next/cache";
import { getTranslations } from "next-intl/server";

import { gqlRequestAuthed } from '@/lib/gql/graphql-client';
import { getError } from "@/lib/utils";
import { graphql } from "@/gqlcodegen";

const UPDATE_DEPARTMENT_MUTATION = graphql(`
  mutation UpdateDepartment($department: UpdateDepartmentInput!) {
    updateDepartment(department: $department) {
      id,
      name
    }
  }
`);

export async function updateDepartmentAction(departmentId: string, name: string) {
  const t = await getTranslations("Departments.toasts");
  try {
    await gqlRequestAuthed(UPDATE_DEPARTMENT_MUTATION, {
      department: { departmentId, name }
    });
    updateTag("departments");

    return { success: true };
  } catch (err) {
    return { error: getError(err, t("updateError")) };
  }
}