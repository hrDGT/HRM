"use client";

import { ArrowDown, MoreVerticalIcon, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { NoResults } from "@/components/ui/no-results";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useFilteredData } from "@/hooks/dashboard/use-filtered-data";
import { useTableControls } from "@/hooks/dashboard/use-table-controls";
import { GetDepartmentsQuery } from "@/gqlcodegen/graphql";
import { useUserStore } from "@/store/use-user-store";

interface Props {
  initialDepartments: GetDepartmentsQuery["departments"];
}

export function DepartmentsClient({ initialDepartments }: Props) {
  const isAdmin = useUserStore((state) => state.isAdmin);

  const {
    sortOrder,
    searchValue,
    toggleSort,
    handleSearchChange,
    resetSearch,
  } = useTableControls();

  const filteredAndSortedDepartments = useFilteredData({
    data: initialDepartments,
    searchValue,
    searchField: "name",
    sortField: "name",
    sortOrder,
  });

  return (
    <section className="max-w-7xl w-full mx-auto">
      <header className="sticky top-0 bg-main-bg z-10 pt-4">
        <h1 className="text-base text-secondary-text opacity-60 ml-4 mb-4">
          Departments
        </h1>
        <div className="flex justify-between items-center gap-x-4 mx-4 mb-4">
          <InputGroup className="inline-flex gap-x-2.5 w-full max-w-80 rounded-4xl max-h-10 p-3 focus-visible:border-main-text hover:border-main-text">
            <InputGroupInput
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Search"
              className="placeholder:text-secondary-text placeholder:opacity-60 text-base"
            />
            <InputGroupAddon>
              <Search className="size-5 stroke-action-color" />
            </InputGroupAddon>
          </InputGroup>
          {isAdmin && (
            <Button className="gap-x-2 aspect-square text-main-red text-sm uppercase rounded-xl hover:bg-action-hover p-0 md:px-2">
              <Plus className="size-5" />
              <span className="hidden md:block">Create department</span>
            </Button>
          )}
        </div>
      </header>

      <Table>
        <TableHeader>
          <TableRow className="border-main-border">
            <TableHead className="text-main-text font-medium p-4 select-none">
              <div
                className="inline-flex items-center gap-x-1 cursor-pointer"
                onClick={toggleSort}
              >
                Name
                <ArrowDown
                  className={cn(
                    "size-4 transition-transform duration-200 stroke-action-color",
                    {
                      "rotate-180": sortOrder === "asc",
                      "rotate-0": sortOrder === "desc",
                    },
                  )}
                />
              </div>
            </TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedDepartments.length > 0 ? (
            filteredAndSortedDepartments.map((dept) => (
              <TableRow
                key={dept.id}
                className="border-main-border font-normal"
              >
                <TableCell className="p-4">{dept.name}</TableCell>
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
                          Update department
                        </DropdownMenuItem>
                        <DropdownMenuItem className="py-1.5 px-4 cursor-pointer hover:bg-main-bg transition-colors text-base">
                          Delete department
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={isAdmin ? 2 : 1}
                className="h-[60vh] whitespace-normal"
              >
                <NoResults onReset={resetSearch} />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
}
