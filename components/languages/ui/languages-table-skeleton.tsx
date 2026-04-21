import { DataTable, type TableColumn } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { TableHead } from "@/components/ui/table";

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

type MockItem = {
  id: number;
  width: string;
};

export function LanguagesTableSkeleton({ isAdmin }: { isAdmin: boolean }) {
  const mockData: MockItem[] = Array.from({ length: 10 }).map((_, index) => ({
    id: index,
    width: SKELETON_WIDTHS[index % SKELETON_WIDTHS.length],
  }));

  const columns: TableColumn<MockItem>[] = [
    {
      header: (
        <TableHead className="p-4">
          <Skeleton className="w-14 h-5 rounded-xl" />
        </TableHead>
      ),
      className: "p-4",
      render: (item) => (
        <Skeleton className="h-8 rounded-xl" style={{ width: item.width }} />
      ),
    },
    {
      header: (
        <TableHead className="p-4">
          <Skeleton className="w-20 h-5 rounded-xl" />
        </TableHead>
      ),
      className: "p-4",
      render: (item) => (
        <Skeleton className="h-8 rounded-xl" style={{ width: item.width }} />
      ),
    },
    {
      header: (
        <TableHead className="p-4">
          <Skeleton className="w-10 h-5 rounded-xl" />
        </TableHead>
      ),
      className: "p-4",
      render: () => (
        <Skeleton className="h-8 rounded-xl" style={{ width: "60px" }} />
      ),
    },
  ];

  if (isAdmin) {
    columns.push({
      header: "",
      className: "text-right py-4 w-[50px] min-w-[50px] max-w-[50px]",
      render: () => <Skeleton className="h-6 w-6 rounded-full ml-auto" />,
    });
  }

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

      <DataTable data={mockData} columns={columns} />
    </section>
  );
}
