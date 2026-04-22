"use client";

import { useRef, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import type { MasteryLevel } from "@/lib/users/skill-utils";

type EnrichedSkill = {
  name: string;
  categoryId: string | null;
  categoryName: string | null;
  categoryParentName: string | null;
  mastery: MasteryLevel;
};

type CVPreviewProps = {
  cv: {
    __typename?: string;
    id: string;
    name: string;
    education?: string | null;
    description: string;
    created_at: string;
    user?: { __typename?: string; id: string; email: string } | null;
    languages?: Array<{ __typename?: string; name: string }> | null;
    projects?: Array<{
      __typename?: string;
      id: string;
      name: string;
      description: string;
      domain: string;
      start_date: string;
      end_date?: string | null;
      environment?: string[];
      responsibilities?: string[];
    }> | null;
  };
  skills: EnrichedSkill[];
};

const ACCENT = "text-red-500";
const BORDER_ACCENT = "border-red-500";

function applyPdfStyles(root: HTMLElement): void {
  const walk = (el: HTMLElement) => {
    const cls = el.classList;

    if (cls.contains("cv-preview-root")) {
      el.style.backgroundColor = "#ffffff";
    }

    if (
      cls.contains("text-zinc-100") ||
      cls.contains("text-zinc-200") ||
      cls.contains("text-zinc-300")
    ) {
      el.style.color = "#000000";
    }

    if (cls.contains("border-zinc-700")) {
      el.style.borderColor = "#d4d4d8";
    }

    for (const child of Array.from(el.children)) {
      if (child instanceof HTMLElement) walk(child);
    }
  };

  walk(root);
}

async function captureElementToPng(element: HTMLElement): Promise<string> {
  const width = element.offsetWidth;
  const height = element.offsetHeight;

  const wrapper = document.createElement("div");
  wrapper.style.cssText = [
    "position:fixed",
    "top:0",
    "left:-9999px",
    `width:${width}px`,
    `height:${height}px`,
    "overflow:hidden",
    "pointer-events:none",
  ].join(";");

  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.cssText = `width:${width}px;height:${height}px;margin:0;`;

  applyPdfStyles(clone);

  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  try {
    return await toPng(clone, {
      backgroundColor: "#ffffff",
      pixelRatio: 2,
      cacheBust: true,
      width,
      height,
      filter: (node) => {
        if (node instanceof HTMLElement && node.dataset.noPrint === "true")
          return false;
        return true;
      },
    });
  } finally {
    document.body.removeChild(wrapper);
  }
}

export function CVPreview({ cv, skills }: CVPreviewProps) {
  const t = useTranslations("CVs");
  const previewRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const skillsTableRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const skillsByCategory = useMemo(() => {
    const groups: Record<string, EnrichedSkill[]> = {};
    for (const skill of skills) {
      const cat =
        skill.categoryName || skill.categoryParentName || "General";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(skill);
    }
    return groups;
  }, [skills]);

  const categoryOrder = [
    "Programming languages",
    "Frontend",
    "Frontend technologies",
    "State management libraries",
    "Form libraries",
    "UI libraries",
    "Backend technologies",
    "Databases",
    "Testing frameworks and tools",
    "DevOps",
    "Source control systems",
  ];

  const sortedCategories = useMemo(() => {
    const ordered: [string, EnrichedSkill[]][] = [];
    for (const cat of categoryOrder) {
      if (skillsByCategory[cat]) ordered.push([cat, skillsByCategory[cat]]);
    }
    for (const [cat, catSkills] of Object.entries(skillsByCategory)) {
      if (!ordered.find(([c]) => c === cat)) ordered.push([cat, catSkills]);
    }
    return ordered;
  }, [skillsByCategory]);

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      await document.fonts.ready;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const addPage = async (element: HTMLElement, pageNumber: number) => {
        const dataUrl = await captureElementToPng(element);
        if (pageNumber > 1) pdf.addPage();
        const elAspect = element.offsetHeight / element.offsetWidth;
        const imgH = Math.min(pdfWidth * elAspect, pdfHeight);
        pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, imgH, undefined, "FAST");
      };

      const pages: Array<{
        ref: React.RefObject<HTMLDivElement | null>;
        condition: boolean;
      }> = [
        { ref: previewRef, condition: true },
        { ref: projectsRef, condition: projects.length > 0 },
        { ref: skillsTableRef, condition: sortedCategories.length > 0 },
      ];

      let pageNumber = 1;
      for (const { ref, condition } of pages) {
        if (condition && ref.current) {
          await addPage(ref.current, pageNumber);
          pageNumber++;
        }
      }

      pdf.save(`${cv.name.replace(/\s+/g, "_")}_CV.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const projects = cv.projects ?? [];
  const languages = cv.languages ?? [];

  return (
    <div className="cv-preview-page space-y-6">
      <div className="flex justify-end" data-no-print="true">
        <Button
          onClick={exportToPDF}
          disabled={isExporting}
          className="h-8 px-6 py-4 bg-transparent hover:bg-transparent text-s text-red-500 border border-red-500/60 rounded-full uppercase tracking-widest hover:text-red-400 hover:border-red-400"
        >
          {isExporting ? t("details.export.exporting") : t("details.export.button")}
        </Button>
      </div>

      <div
        ref={previewRef}
        className="cv-preview-root p-10 rounded-xl bg-[#353535] text-zinc-200 max-w-4xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-[28px] font-semibold text-zinc-100 leading-tight">{cv.name}</h1>
          <p className="text-sm font-medium text-zinc-400 mt-1 uppercase tracking-wide">
            Software Engineer
          </p>
        </div>

        <div className="flex gap-8">
          <div className="w-[180px] shrink-0 space-y-5">
            {cv.education && (
              <section>
                <h3 className="text-sm font-semibold text-zinc-100 mb-1">
                  {t("details.previewTab.education")}
                </h3>
                <p className="text-sm text-zinc-300">{cv.education}</p>
              </section>
            )}

            {languages.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold text-zinc-100 mb-1">
                  Language proficiency
                </h3>
                <ul className="space-y-0.5">
                  {languages.map((lang) => (
                    <li key={lang.name} className="text-sm text-zinc-300">
                      {lang.name}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <div className={`flex-1 pl-8 ${BORDER_ACCENT} border-l`}>
            {cv.description && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-zinc-100 mb-2">
                  Software Engineer with {cv.description.match(/\d+\+/g)?.[0] || "5+"} years of experience
                </p>
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                  {cv.description}
                </p>
              </div>
            )}

            {sortedCategories.length > 0 && (
              <div className="space-y-4">
                {sortedCategories.map(([category, catSkills]) => (
                  <div key={category}>
                    <h4 className="text-sm font-semibold text-zinc-100 mb-1">
                      {category}
                    </h4>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      {catSkills.map((s) => s.name).join(", ")}.
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {projects.length > 0 && (
        <div
          ref={projectsRef}
          className="cv-preview-root p-10 rounded-xl bg-[#353535] text-zinc-200 max-w-4xl mx-auto"
        >
          <section>
            <h2 className="text-2xl font-light text-zinc-100 mb-4">Projects</h2>
            <div className={`h-[1px] ${BORDER_ACCENT} bg-red-500 mb-6`} />
            <div className="space-y-6">
              {projects.map((proj) => (
                <div key={proj.id} className="space-y-1">
                  <h3 className="text-base font-semibold text-zinc-100">{proj.name}</h3>
                  <p className="text-xs text-zinc-500">
                    {proj.start_date} — {proj.end_date || "Present"}
                    {proj.domain && ` • ${proj.domain}`}
                  </p>
                  {proj.description && (
                    <p className="text-sm text-zinc-300 leading-relaxed">{proj.description}</p>
                  )}
                  {proj.environment && proj.environment.length > 0 && (
                    <p className="text-sm text-zinc-400">
                      <span className="text-zinc-500">Env: </span>
                      {proj.environment.join(", ")}
                    </p>
                  )}
                  {proj.responsibilities && proj.responsibilities.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-zinc-500 mb-1">Responsibilities:</p>
                      <ul className="text-sm text-zinc-300 list-disc list-inside space-y-0.5">
                        {proj.responsibilities.map((resp, idx) => (
                          <li key={idx}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {sortedCategories.length > 0 && (
        <div
          ref={skillsTableRef}
          className="cv-preview-root p-10 rounded-xl bg-[#353535] text-zinc-200 max-w-4xl mx-auto"
        >
          <section>
            <h2 className="text-2xl font-light text-zinc-100 mb-4">Professional skills</h2>

            <table className="w-full text-sm">
              <thead>
                <tr className={`${BORDER_ACCENT} border-b`}>
                  <th className="py-2 px-0 text-left text-[10px] uppercase tracking-wider text-zinc-400">Category</th>
                  <th className="py-2 px-0 text-left text-[10px] uppercase tracking-wider text-zinc-400">Skills</th>
                  <th className="py-2 px-0 text-right text-[10px] uppercase tracking-wider text-zinc-400">Mastery</th>
                </tr>
              </thead>
              <tbody>
                {sortedCategories.map(([category, catSkills]) =>
                  catSkills.map((skill, idx) => {
                    const isFirst = idx === 0;
                    const isLast = idx === catSkills.length - 1;
                    return (
                      <tr
                        key={`${category}-${skill.name}`}
                        className={`border-b ${isLast ? BORDER_ACCENT : "border-zinc-700"}`}
                      >
                        {isFirst && (
                          <td rowSpan={catSkills.length} className={`py-2 px-0 align-top ${ACCENT} text-xs font-medium`}>
                            {category}
                          </td>
                        )}
                        <td className="py-1.5 px-0 text-zinc-300">{skill.name}</td>
                        <td className="py-1.5 px-0 text-right text-zinc-500 capitalize">{skill.mastery}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </section>
        </div>
      )}
    </div>
  );
}
