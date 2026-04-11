import { ChangeEvent, useState } from "react";

type SortOrder = "asc" | "desc";

export function useTableControls(initialSort: SortOrder = "asc") {
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialSort);
  const [searchValue, setSearchValue] = useState("");

  const toggleSort = () => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const resetSearch = () => {
    setSearchValue("");
  };

  return {
    sortOrder,
    searchValue,
    toggleSort,
    handleSearchChange,
    resetSearch,
  };
}