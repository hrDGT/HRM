import React from "react";
import { MoreVerticalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type TableColumn<T> = {
  header: React.ReactNode;
  render: (item: T) => React.ReactNode;
  className?: string;
};

export type TableAction<T> = {
  title: string;
  action: (item: T) => void;
};

type Props<T> = {
  data: T[];
  columns: TableColumn<T>[];
  emptyState?: React.ReactNode;
  actions?: TableAction<T>[];
  actionMenuLabel?: string;
  isPending?: boolean;
};

export function DataTable<T>({
  data,
  columns,
  emptyState,
  actions,
  actionMenuLabel = "Open menu",
  isPending = false,
}: Props<T>) {
  const hasActions = actions && actions.length > 0;

  return (
    <div className="flex-1 overflow-auto">
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow className="border-main-border">
            {columns.map((col, index) => (
              <React.Fragment key={index}>
                {typeof col.header === "string" ? (
                  <TableHead className={col.className}>{col.header}</TableHead>
                ) : (
                  col.header
                )}
              </React.Fragment>
            ))}
            {hasActions && (
              <TableHead className="text-right py-4 w-12.5 min-w-12.5 max-w-12.5"></TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length > 0
            ? data.map((item, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className="border-main-border font-normal min-h-16.25"
                >
                  {columns.map((col, colIndex) => (
                    <TableCell
                      key={colIndex}
                      className={col.className || "p-4"}
                    >
                      {col.render(item)}
                    </TableCell>
                  ))}

                  {hasActions && (
                    <TableCell className="text-right py-4 w-12.5 min-w-12.5 max-w-12.5">
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-full transition-opacity disabled:opacity-50 hover:bg-active-sidebar-bg"
                            disabled={isPending}
                          >
                            <MoreVerticalIcon className="size-5 stroke-action-color" />
                            <span className="sr-only">{actionMenuLabel}</span>
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          className="bg-action-menu-bg w-full py-2 px-0 rounded-[4px] shadow-action-menu"
                          align="end"
                        >
                          {actions.map((act, i) => (
                            <DropdownMenuItem
                              key={i}
                              className={
                                "py-1.5 px-4 cursor-pointer hover:bg-main-bg transition-colors text-base"
                              }
                              onSelect={() => act.action(item)}
                            >
                              {act.title}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            : emptyState}
        </TableBody>
      </Table>
    </div>
  );
}
