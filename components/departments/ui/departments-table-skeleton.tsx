import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SKELETON_WIDTHS = [
  "45%",
  "28%",
  "44%",
  "21%",
  "54%",
  "32%",
  "44%",
  "22%",
  "41%",
  "36%",
];

export function DepartmentsTableSkeleton({ isAdmin }: { isAdmin: boolean }) {
  const skeletonRows = Array.from({ length: 10 });

  return (
    <section className="max-w-7xl w-full mx-auto">
      <div className="pt-4 ml-4 mb-4">
        <Skeleton className="h-6 w-25 rounded-xl bg-skeleton-bg" />
      </div>

      <div className="flex items-center justify-between gap-x-4 mx-4 mb-4">
        <Skeleton className="h-10 w-full max-w-80 rounded-4xl p-3" />
        {isAdmin && (
          <div className="flex items-center gap-x-2">
            <Skeleton className="w-12 h-12 rounded-xl md:w-47" />
          </div>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-main-border">
            <TableHead className="p-4">
              <Skeleton className="w-14 h-5 rounded-xl" />
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {skeletonRows.map((_, index) => (
            <TableRow key={index} className="border-main-border">
              <TableCell className="py-4">
                <Skeleton
                  className="h-8 rounded-xl"
                  style={{
                    width: SKELETON_WIDTHS[index % SKELETON_WIDTHS.length],
                  }}
                />
              </TableCell>
              {isAdmin && (
                <TableCell className="text-right py-4">
                  <Skeleton className="h-6 w-6 rounded-full ml-auto" />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
