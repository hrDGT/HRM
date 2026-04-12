import { useTransition } from "react";
import { toast } from "sonner";

import { useFilteredData } from "@/components/dashboard/hooks/use-filtered-data";
import { useTableControls } from "@/components/dashboard/hooks/use-table-controls";
import { GetDepartmentsQuery } from "@/gqlcodegen/graphql";

import { deleteDepartmentAction } from "../actions/delete-departments-action";

type DepartmentItem = GetDepartmentsQuery["departments"][0];

export function useDepartmentsLogic(initialDepartments: DepartmentItem[], isAdmin: boolean) {

  const {
    sortField, sortOrder, searchValue,
    handleSort, handleSearchChange, resetSearch,
  } = useTableControls<DepartmentItem>("name");

  const filteredAndSortedDepartments = useFilteredData({
    data: initialDepartments,
    searchValue,
    searchField: "name",
    sortField,
    sortOrder,
  });

  const [isPending, startTransition] = useTransition();

  const handleDelete = (departmentId: string) => {
    startTransition(async () => {
      const result = await deleteDepartmentAction(departmentId);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Department deleted successfully");
      }
    });
  };

  return {
    isAdmin,
    searchValue,
    sortField,
    sortOrder,
    filteredDepartments: filteredAndSortedDepartments,
    handleSort,
    handleSearchChange,
    resetSearch,
    handleDelete,
    isPending,
  };
}