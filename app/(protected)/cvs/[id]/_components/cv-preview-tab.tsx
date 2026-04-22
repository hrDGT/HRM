"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

type CVPreviewTabProps = {
  cv: {
    name: string;
    education?: string | null;
    description: string;
    skills: Array<{ name: string; mastery: string }>;
    projects?: Array<{ id: string; name: string }> | null;
  };
};

export function CVPreviewTab({ cv }: CVPreviewTabProps) {
  const t = useTranslations("CVs");
  const previewRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(previewRef.current, { backgroundColor: "#353535", pixelRatio: 2 });
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const img = new Image();
      img.src = dataUrl;
      await new Promise(r => { img.onload = r; });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (img.height * pdfWidth) / img.width;
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${cv.name.replace(/\s+/g, "_")}_CV.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const projects = cv.projects ?? [];
  const skills = cv.skills;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={exportToPDF} disabled={isExporting} className="h-10 px-4 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded-4xl uppercase text-xs tracking-widest border border-white/10">
          <Download size={16} className="mr-2" />
          {isExporting ? t("details.export.exporting") : t("details.export.button")}
        </Button>
      </div>
      <div ref={previewRef} className="p-8 rounded-xl bg-[#2a2a2a] text-zinc-200 max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-zinc-100">{cv.name}</h1>
        <div className="grid grid-cols-3 gap-6 text-sm">
          <div><h3 className="font-semibold uppercase text-zinc-400 mb-2">{t("details.previewTab.education")}</h3><p className="text-zinc-300">{cv.education || "—"}</p></div>
          <div><h3 className="font-semibold uppercase text-zinc-400 mb-2">{t("details.previewTab.skills")}</h3><p className="text-zinc-300">{skills.map(s => `${s.name} (${s.mastery})`).join(", ") || "—"}</p></div>
          <div><h3 className="font-semibold uppercase text-zinc-400 mb-2">{t("details.previewTab.projects")}</h3><p className="text-zinc-300">{projects.map(p => p.name).join(", ") || "—"}</p></div>
        </div>
        <div><h3 className="font-semibold uppercase text-zinc-400 mb-2">{t("details.previewTab.description") || "Description"}</h3><p className="text-zinc-300 leading-relaxed">{cv.description}</p></div>
      </div>
    </div>
  );
}
