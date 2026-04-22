import { ArrowDown } from "lucide-react";

import { TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface Props<T extends string> {
  headTitle: string;
  field: T;
  currentSortField: string;
  sortOrder: "asc" | "desc";
  onSort: (field: T) => void;
}

export function DashboardTableHead<T extends string>({
  headTitle,
  field,
  currentSortField,
  sortOrder,
  onSort,
}: Props<T>) {
  const isActive = currentSortField === field;

  return (
    <TableHead className="text-main-text font-medium p-4 select-none">
      <div
        className="inline-flex items-center gap-x-1 cursor-pointer hover:text-secondary-text transition-colors"
        onClick={() => onSort(field)}
      >
        {headTitle}

        {isActive && (
          <ArrowDown
            className={cn(
              "size-4 transition-transform duration-200 stroke-secondary-text",
              {
                "rotate-180": sortOrder === "asc",
                "rotate-0": sortOrder === "desc",
              },
            )}
          />
        )}
      </div>
    </TableHead>
  );
}
