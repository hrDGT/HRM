import { ReactNode } from "react";
import { useTranslations } from "next-intl";

import { TableCell, TableRow } from "@/components/ui/table";

interface NoResultsProps {
  isAdmin: boolean;
  onReset?: () => void;
  columnsCount: number;
  action: ReactNode;
}

export function DashBoardNoResults({
  isAdmin,
  onReset,
  columnsCount,
  action,
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

          {onReset && action}
        </div>
      </TableCell>
    </TableRow>
  );
}
