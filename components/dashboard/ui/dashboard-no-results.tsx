"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

interface NoResultsProps {
  isAdmin: boolean;
  onReset?: () => void;
  columnsCount: number;
}

export function DashBoardNoResults({
  isAdmin,
  onReset,
  columnsCount,
}: NoResultsProps) {
  const t = useTranslations("Common");
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell
        colSpan={isAdmin ? columnsCount + 1 : columnsCount}
        className="h-[60vh] whitespace-normal align-middle"
      >
        <div className="flex flex-col items-center justify-center h-full w-full py-10 text-center">
          <h3 className="text-2xl text-main-text mb-2">
            {t("noResults.title")}
          </h3>
          <p className="text-base text-secondary-text mb-6">
            {t("noResults.description")}
          </p>

          {onReset && (
            <Button
              variant="ghost"
              onClick={onReset}
              className="uppercase text-secondary-text hover:underline text-sm font-medium tracking-wide"
            >
              {t("actions.resetSearch")}
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
