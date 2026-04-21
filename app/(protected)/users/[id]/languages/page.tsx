import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/require-user";
import { gqlRequestAuthed } from "@/lib/gql/graphql-client";
import { graphql } from "@/gqlcodegen";
import type { ResultOf, TypedDocumentNode } from "@graphql-typed-document-node/core";
import { UserLanguages } from "../_components/user-languages";
import { getAuthProps } from "@/lib/auth/get-auth-props";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { TabsNav } from "@/components/common/tabs-nav";

const GET_EMPLOYEE_LANGUAGES_QUERY = graphql(`
  query GetEmployeeLanguages($userId: ID!) {
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

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = Number(id);
  if (isNaN(userId)) return {};

  const [result, t] = await Promise.all([
    gqlRequestAuthed(GET_EMPLOYEE_LANGUAGES_QUERY, { userId: String(userId) }),
    getTranslations("Users"),
  ]);

  if (!result.user) return {};

  const profile = result.user.profile;
  const firstName = profile?.first_name ?? "";
  const lastName = profile?.last_name ?? "";
  const name = `${firstName} ${lastName}`.trim() || result.user.email;

  return { title: `${name} — ${t("tabs.languages")}` };
}

export default async function UserLanguagesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = Number(id);
  if (isNaN(userId)) notFound();

  const [currentUser, { token, cookieHeader }] = await Promise.all([
    requireUser(),
    getAuthProps(),
  ]);

  const result = await gqlRequestAuthed(GET_EMPLOYEE_LANGUAGES_QUERY, { userId: String(userId) }, { token, cookieHeader });

  if (!result.user) notFound();

  const firstName = result.user.profile?.first_name ?? "";
  const lastName = result.user.profile?.last_name ?? "";
  const fullName = `${firstName} ${lastName}`.trim() || result.user.email;
  const canEdit = result.user.id === currentUser.id || currentUser.role?.toUpperCase() === "ADMIN";

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
        <span className="text-red-500">{t("tabs.languages")}</span>
      </div>

      <div className="px-8 pb-6">
        <TabsNav tabs={TABS} />
      </div>

      <UserLanguages userId={userId} canEdit={canEdit} />
    </div>
  );
}
