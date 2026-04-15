'use client'

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useFilteredData } from "@/components/dashboard/hooks/use-filtered-data";
import { useTableControls } from "@/components/dashboard/hooks/use-table-controls";
import { GetPositionsQuery } from "@/gqlcodegen/graphql";

import { deletePositionAction } from "../actions/delete-positions-action";


type PositionItem = GetPositionsQuery["positions"][0];

export function usePositionsLogic(initialPositions: PositionItem[], isAdmin: boolean) {
  const t = useTranslations("Positions");

  const {
    sortField, sortOrder, searchValue,
    handleSort, handleSearchChange, resetSearch,
  } = useTableControls<PositionItem>("name");

  const filteredAndSortedPositions = useFilteredData({
    data: initialPositions,
    searchValue,
    searchField: "name",
    sortField,
    sortOrder,
  });

  const [isPending, startTransition] = useTransition();

  const handleDelete = (positionId: string) => {
    startTransition(async () => {
      const result = await deletePositionAction(positionId);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(t("toasts.deleted"));
      }
    });
  };

  return {
    isAdmin,
    searchValue,
    sortField,
    sortOrder,
    filteredPositions: filteredAndSortedPositions,
    handleSort,
    handleSearchChange,
    resetSearch,
    handleDelete,
    isPending,
  };
}