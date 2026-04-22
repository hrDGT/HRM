import { getTranslations } from "next-intl/server";
import type { ResultOf } from "@graphql-typed-document-node/core";
import { requireUser } from "@/lib/auth/require-user";
import { getAuthProps } from "@/lib/auth/get-auth-props";
import { gqlRequestAuthed } from "@/lib/gql/graphql-client";
import { graphql } from "@/gqlcodegen";

import { CVsClient } from "./_components/cvs-client";

const GET_CVS_QUERY = graphql(`
  query GetCVs {
    cvs {
      id
      name
      education
      description
      user {
        email
      }
    }
  }
`);

type GetCVsResult = ResultOf<typeof GET_CVS_QUERY>;

export async function generateMetadata() {
  const t = await getTranslations("CVs");
  return { title: t("title") };
}

export default async function CVsPage() {
  const [currentUser, { token, cookieHeader }] = await Promise.all([
    requireUser(),
    getAuthProps(),
  ]);

  const result = await gqlRequestAuthed(GET_CVS_QUERY, undefined, {
    token,
    cookieHeader,
  });

  const cvs = result.cvs?.map((cv) => ({
    id: cv.id,
    name: cv.name ?? "",
    education: cv.education ?? "",
    description: cv.description ?? "",
    userEmail: cv.user?.email ?? "",
  })) ?? [];

  return (
    <CVsClient
      initialCVs={cvs}
      currentUserRole={currentUser.role}
      currentUserEmail={currentUser.email ?? ""}
      currentUserId={currentUser.id}
    />
  );
}
