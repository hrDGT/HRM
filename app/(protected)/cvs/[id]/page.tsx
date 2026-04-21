import { getTranslations } from "next-intl/server";
import type { ResultOf } from "@graphql-typed-document-node/core";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/require-user";
import { getAuthProps } from "@/lib/auth/get-auth-props";
import { gqlRequestAuthed } from "@/lib/gql/graphql-client";
import { graphql } from "@/gqlcodegen";
import { CVDetailsClient } from "./_components/cv-details-client";

const GET_CV_DETAILS = graphql(`
  query GetCVDetails($cvId: ID!) {
    cv(cvId: $cvId) {
      id
      name
      education
      description
      created_at
      user {
        id
        email
      }
      skills {
        name
        categoryId
        mastery
      }
      projects {
        id
        name
        description
        domain
        start_date
        end_date
        environment
        responsibilities
      }
    }
  }
`);

type GetCVDetailsResult = ResultOf<typeof GET_CV_DETAILS>;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations("CVs");
  const { token, cookieHeader } = await getAuthProps();
  const result = await gqlRequestAuthed(GET_CV_DETAILS, { cvId: id }, { token, cookieHeader }).catch(() => null);
  const cvName = result?.cv?.name ?? "CV";
  return { title: `${cvName} | ${t("title")}` };
}

export default async function CVDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [currentUser, { token, cookieHeader }] = await Promise.all([
    requireUser(),
    getAuthProps(),
  ]);

  const result = await gqlRequestAuthed(GET_CV_DETAILS, { cvId: id }, { token, cookieHeader }).catch(() => null);
  if (!result?.cv) notFound();

  const cv = result.cv;
  const canEdit = cv.user?.id === String(currentUser.id) || currentUser.role?.toUpperCase() === "ADMIN";

  return (
    <CVDetailsClient
      cv={cv}
      currentUserId={String(currentUser.id)}
      currentUserRole={currentUser.role}
      canEdit={canEdit}
    />
  );
}
