import { useDeferredValue, useMemo } from "react";

import { sortByField } from "@/lib/utils";

interface UseFilteredDataProps<T> {
  data: T[];
  searchValue: string;
  searchField: keyof T;
  sortField: keyof T;
  sortOrder: "asc" | "desc";
}

export function useFilteredData<T>({
  data,
  searchValue,
  searchField,
  sortField,
  sortOrder,
}: UseFilteredDataProps<T>) {
  const deferredSearch = useDeferredValue(searchValue);

  const processedData = useMemo(() => {
    let processed = data;

    if (deferredSearch) {
      const lowercasedFilter = deferredSearch.toLowerCase();
      processed = processed.filter((item) => {
        const value = String(item[searchField] || "");
        return value.toLowerCase().includes(lowercasedFilter);
      });
    }

    return sortByField(processed, sortField, sortOrder);
  }, [data, deferredSearch, searchField, sortField, sortOrder]);

  return processedData;
}