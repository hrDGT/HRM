import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type {
  ResultOf,
  TypedDocumentNode,
} from "@graphql-typed-document-node/core";
import { ChevronRight } from "lucide-react";

import { getAuthProps } from "@/lib/auth/get-auth-props";
import { requireUser } from "@/lib/auth/require-user";
import { gqlRequestAuthed } from "@/lib/gql/graphql-client";
import { graphql } from "@/gqlcodegen";

import { ProfileTabs } from "../_components/profile-tabs";
import { UserSkills } from "../_components/user-skills";

const GET_EMPLOYEE_SKILLS_QUERY = graphql(`
  query GetEmployeeSkills($userId: ID!) {
    user(userId: $userId) {
      id
      email
      role
      profile {
        first_name
        last_name
      }
    }
  }
`) as TypedDocumentNode<{ user: any }, { userId: string }>;

type GetEmployeeSkillsResult = ResultOf<typeof GET_EMPLOYEE_SKILLS_QUERY>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = Number(id);
  if (isNaN(userId)) return {};

  const [result, t] = await Promise.all([
    gqlRequestAuthed(GET_EMPLOYEE_SKILLS_QUERY, { userId: String(userId) }),
    getTranslations("Users"),
  ]);

  if (!result.user) return {};

  const profile = result.user.profile;
  const firstName = profile?.first_name ?? "";
  const lastName = profile?.last_name ?? "";
  const name = `${firstName} ${lastName}`.trim() || result.user.email;

  return { title: `${name} — ${t("tabs.skills")}` };
}

export default async function UserSkillsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = Number(id);
  if (isNaN(userId)) notFound();

  const [currentUser, { token, cookieHeader }] = await Promise.all([
    requireUser(),
    getAuthProps(),
  ]);

  const result = await gqlRequestAuthed(
    GET_EMPLOYEE_SKILLS_QUERY,
    { userId: String(userId) },
    { token, cookieHeader },
  );

  if (!result.user) notFound();

  const firstName = result.user.profile?.first_name ?? "";
  const lastName = result.user.profile?.last_name ?? "";
  const fullName = `${firstName} ${lastName}`.trim() || result.user.email;
  const canEdit =
    result.user.id === currentUser.id ||
    currentUser.role?.toUpperCase() === "ADMIN";

  const t = await getTranslations("Users");
  const TABS = [
    { id: "profile", label: t("tabs.profile"), href: `/users/${id}` },
    { id: "skills", label: t("tabs.skills"), href: `/users/${id}/skills` },
    {
      id: "languages",
      label: t("tabs.languages"),
      href: `/users/${id}/languages`,
    },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
      <div className="flex items-center gap-2 px-8 py-4 text-sm shrink-0">
        <Link
          href="/users"
          className="text-secondary-text text-base hover:underline transition-colors"
        >
          {t("title")}
        </Link>
        <ChevronRight size={16} className="text-disabled-btn" />
        <Link
          href={`/users/${id}`}
          className="text-secondary-text text-base hover:underline transition-colors"
        >
          {fullName}
        </Link>
        <ChevronRight size={16} className="text-disabled-btn" />
        <span className="text-primary">{t("tabs.skills")}</span>
      </div>

      <div className="px-8 pb-6">
        <ProfileTabs tabs={TABS} userId={id} />
      </div>

      <UserSkills userId={userId} canEdit={canEdit} />
    </div>
  );
}
