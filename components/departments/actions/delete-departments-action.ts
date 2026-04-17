"use server";

import { updateTag } from "next/cache";
import { getTranslations } from "next-intl/server";

import { gqlRequestAuthed } from '@/lib/gql/graphql-client';
import { getError } from "@/lib/utils";
import { graphql } from "@/gqlcodegen";

const DELETE_DEPARTMENT_MUTATION = graphql(`
  mutation DeleteDepartment($department: DeleteDepartmentInput!) {
    deleteDepartment(department: $department) {
      affected
    }
  }
`);

export async function deleteDepartmentAction(departmentId: string) {
  const t = await getTranslations("Departments.toasts");
  try {
    await gqlRequestAuthed(DELETE_DEPARTMENT_MUTATION, {
      department: { departmentId }
    });
    updateTag("departments");

    return { success: true };
  } catch (err) {
    return { error: getError(err, t("deleteError")) };
  }
}