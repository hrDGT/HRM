import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/require-user";
import { gqlRequestAuthed } from "@/lib/gql/graphql-client";
import { graphql } from "@/gqlcodegen";
import { getAuthProps } from "@/lib/auth/get-auth-props";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { TabsNav } from "@/components/common/tabs-nav";
import { CVPreview } from "../_components/cv-preview";
import { getCVSkills } from "../../actions";

const GET_CV_PREVIEW_DETAILS = graphql(`
  query GetCVPreviewDetails($cvId: ID!) {
    cv(cvId: $cvId) {
      id
      name
      education
      description
      created_at
      user { id email }
      languages { name }
      skills { name categoryId mastery }
      projects { id name description domain start_date end_date environment }
    }
  }
`);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations("CVs");
  return { title: `${t("details.tabs.preview")}` };
}

export default async function CVPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [currentUser, { token, cookieHeader }] = await Promise.all([requireUser(), getAuthProps()]);
  
  const result = await gqlRequestAuthed(GET_CV_PREVIEW_DETAILS, { cvId: id }, { token, cookieHeader }).catch(() => null);
  if (!result?.cv) notFound();

  const cv = result.cv;
  const canEdit = cv.user?.id === String(currentUser.id) || currentUser.role?.toUpperCase() === "ADMIN";

  const enrichedSkills = await getCVSkills(id).catch(() => []);

  const t = await getTranslations("CVs");
  const TABS = [
    { id: "details", label: t("details.tabs.details"), href: `/cvs/${id}` },
    { id: "skills", label: t("details.tabs.skills"), href: `/cvs/${id}/skills` },
    { id: "projects", label: t("details.tabs.projects"), href: `/cvs/${id}/projects` },
    { id: "preview", label: t("details.tabs.preview"), href: `/cvs/${id}/preview` },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#353535]">
      <div className="flex items-center gap-2 px-8 py-4 text-sm">
        <Link href="/cvs" className="text-zinc-400 hover:text-zinc-200 transition-colors">{t("details.breadcrumb.cvs")}</Link>
        <ChevronRight size={16} className="text-zinc-600" />
        <span className="text-zinc-100">{cv.name}</span>
      </div>
      <div className="px-8 pb-4">
        <TabsNav tabs={TABS} />
      </div>
      <div className="flex-1 px-8 pb-8">
        <CVPreview cv={cv} skills={enrichedSkills} />
      </div>
    </div>
  );
}
