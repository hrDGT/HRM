import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/require-user";
import { gqlRequestAuthed } from "@/lib/gql/graphql-client";
import { graphql } from "@/gqlcodegen";
import { getAuthProps } from "@/lib/auth/get-auth-props";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { TabsNav } from "@/components/common/tabs-nav";
import { CVsClient } from "@/app/(protected)/cvs/_components/cvs-client";

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

const GET_USER_PROFILE_QUERY = graphql(`
  query GetUserProfile($userId: ID!) {
    user(userId: $userId) {
      id
      email
      profile {
        first_name
        last_name
      }
    }
  }
`);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations("CVs");
  return { title: `${t("title")} | User ${id}` };
}

export default async function UserCVsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [currentUser, { token, cookieHeader }] = await Promise.all([
    requireUser(),
    getAuthProps(),
  ]);

  const [cvResult, userResult] = await Promise.all([
    gqlRequestAuthed(GET_USER_CVS_QUERY, undefined, { token, cookieHeader }).catch(() => null),
    gqlRequestAuthed(GET_USER_PROFILE_QUERY, { userId: id }, { token, cookieHeader }).catch(() => null),
  ]);

  if (!cvResult?.cvs || !userResult?.user) notFound();

  const userCvs = cvResult.cvs.filter((cv) => cv.user?.id === id);
  const cvs = userCvs.map((cv) => ({
    id: cv.id,
    name: cv.name ?? "",
    education: cv.education ?? "",
    description: cv.description ?? "",
    userEmail: cv.user?.email ?? "",
  }));

  const profile = userResult.user.profile;
  const firstName = profile?.first_name ?? "";
  const lastName = profile?.last_name ?? "";
  const fullName = `${firstName} ${lastName}`.trim() || userResult.user.email;

  const t = await getTranslations("Users");
  const TABS = [
    { id: "profile", label: t("tabs.profile"), href: `/users/${id}` },
    { id: "skills", label: t("tabs.skills"), href: `/users/${id}/skills` },
    { id: "languages", label: t("tabs.languages"), href: `/users/${id}/languages` },
    { id: "cvs", label: t("nav.cvs"), href: `/users/${id}/cvs` },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#353535]">
      <div className="flex items-center gap-2 px-8 py-4 text-sm">
        <Link href="/users" className="text-zinc-400 hover:text-zinc-200 transition-colors">
          {t("title")}
        </Link>
        <ChevronRight size={16} className="text-zinc-600" />
        <Link href={`/users/${id}`} className="text-zinc-400 hover:text-zinc-200 transition-colors">
          {fullName}
        </Link>
        <ChevronRight size={16} className="text-zinc-600" />
        <span className="text-red-500">{t("nav.cvs")}</span>
      </div>

      <div className="px-8 pb-6">
        <TabsNav tabs={TABS} />
      </div>

      <CVsClient
        initialCVs={cvs}
        currentUserRole={currentUser.role}
        currentUserEmail={currentUser.email ?? ""}
      />
    </div>
  );
}
