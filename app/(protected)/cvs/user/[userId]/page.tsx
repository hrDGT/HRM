import { getTranslations } from "next-intl/server";
import type { ResultOf } from "@graphql-typed-document-node/core";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/require-user";
import { getAuthProps } from "@/lib/auth/get-auth-props";
import { gqlRequestAuthed } from "@/lib/gql/graphql-client";
import { graphql } from "@/gqlcodegen";

import { CVsClient } from "../../_components/cvs-client";

const GET_USER_CVS_QUERY = graphql(`
  query GetUserCVs {
    cvs {
      id
      name
      education
      description
      user {
        id
        email
      }
    }
  }
`);

type GetUserCVsResult = ResultOf<typeof GET_USER_CVS_QUERY>;

export async function generateMetadata({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const t = await getTranslations("CVs");
  return { title: `${t("title")} | User ${userId}` };
}

export default async function UserCVsPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const [currentUser, { token, cookieHeader }] = await Promise.all([
    requireUser(),
    getAuthProps(),
  ]);

  const result = await gqlRequestAuthed(GET_USER_CVS_QUERY, undefined, { token, cookieHeader }).catch(() => null);
  if (!result?.cvs) notFound();

  const userCvs = result.cvs.filter((cv) => cv.user?.id === userId);

  const cvs = userCvs.map((cv) => ({
    id: cv.id,
    name: cv.name ?? "",
    education: cv.education ?? "",
    description: cv.description ?? "",
    userEmail: cv.user?.email ?? "",
  }));

  return (
    <CVsClient
      initialCVs={cvs}
      currentUserRole={currentUser.role}
      currentUserEmail={currentUser.email ?? ""}
    />
  );
}
