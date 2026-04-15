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

  let processed = data;

  if (searchValue) {
    const lowercasedFilter = searchValue.toLowerCase();
    processed = processed.filter((item) => {
      const value = String(item[searchField] || "");
      return value.toLowerCase().includes(lowercasedFilter);
    });
  }

  return sortByField([...processed], sortField, sortOrder);
}