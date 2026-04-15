import React from "react";

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

interface Props<T> {
  data: T[];
  columns: TableColumn<T>[];
  emptyState?: React.ReactNode;
}

export function DataTable<T>({ data, columns, emptyState }: Props<T>) {
  return (
    <Table>
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
                  <TableCell key={colIndex} className={col.className || "p-4"}>
                    {col.render(item)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          : emptyState}
      </TableBody>
    </Table>
  );
}
