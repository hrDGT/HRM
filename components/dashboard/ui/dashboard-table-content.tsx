import { MoreVerticalIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";

import { Button } from "../../ui/button";

import { DashBoardNoResults } from "./dashboard-no-results";

type Props<T extends { id: string }> = {
  data: T[];
  isAdmin: boolean;
  actionTitle: string;
  columnsCount: number;
  onReset: () => void;
  onDelete: (departmentId: string) => void;
  children: (item: T) => React.ReactNode;
};

export function DashboardTableContent<T extends { id: string }>({
  data,
  isAdmin,
  actionTitle,
  columnsCount,
  onReset,
  onDelete,
  children,
}: Props<T>) {
  return (
    <>
      {data.length > 0 ? (
        data.map((item) => (
          <TableRow
            key={item.id}
            className="border-main-border font-normal min-h-16.25"
          >
            {children(item)}

            {isAdmin && (
              <TableCell className="text-right py-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 rounded-full hover:bg-action-hover"
                    >
                      <MoreVerticalIcon className="size-5 stroke-action-color" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="bg-white w-full py-2"
                    align="end"
                    onCloseAutoFocus={(e) => e.preventDefault()}
                  >
                    <DropdownMenuItem className="py-1.5 px-4 cursor-pointer hover:bg-main-bg transition-colors text-base">
                      Update {actionTitle}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="py-1.5 px-4 cursor-pointer hover:bg-main-bg transition-colors text-base"
                      onClick={() => onDelete(item.id)}
                    >
                      Delete {actionTitle}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            )}
          </TableRow>
        ))
      ) : (
        <DashBoardNoResults
          isAdmin={isAdmin}
          onReset={onReset}
          columnsCount={columnsCount}
        />
      )}
    </>
  );
}
