import { ChangeEvent, useState } from "react";

type SortOrder = "asc" | "desc";

export function useTableControls<T>(initialSortField: keyof T, initialOrder: SortOrder = "asc") {
  const [sortField, setSortField] = useState<keyof T>(initialSortField);
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialOrder);
  const [searchValue, setSearchValue] = useState("");

  const handleSort = (field: keyof T) => {
    if (field === sortField) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const resetSearch = () => {
    setSearchValue("");
  };

  return {
    sortField,
    sortOrder,
    searchValue,
    handleSort,
    handleSearchChange,
    resetSearch,
  };
}