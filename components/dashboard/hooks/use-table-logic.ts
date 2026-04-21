'use client'

import { useTransition } from "react";
import { toast } from "sonner";

import { useFilteredData } from "./use-filtered-data";
import { useTableControls } from "./use-table-controls";

interface UseTableLogicProps<T> {
  initialData: T[];
  isAdmin: boolean;
  searchFields: (keyof T)[];
  initialSortField: keyof T;
  deleteAction?: (id: string) => Promise<{ error?: string; success?: boolean }>;
  deleteSuccessMessage?: string;
}

export function useTableLogic<T>({
  initialData,
  isAdmin,
  searchFields,
  initialSortField,
  deleteAction,
  deleteSuccessMessage = "Deleted successfully",
}: UseTableLogicProps<T>) {

  const {
    sortField, sortOrder, searchValue,
    handleSort, handleSearchChange, resetSearch,
  } = useTableControls<T>(initialSortField);

  const filteredAndSortedData = useFilteredData<T>({
    data: initialData,
    searchValue,
    searchFields,
    sortField,
    sortOrder,
  });

  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (!deleteAction) return;

    startTransition(async () => {
      const result = await deleteAction(id);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(deleteSuccessMessage);
      }
    });
  };

  return {
    isAdmin,
    searchValue,
    sortField,
    sortOrder,
    filteredData: filteredAndSortedData,
    handleSort,
    handleSearchChange,
    resetSearch,
    handleDelete,
    isPending,
  };
}