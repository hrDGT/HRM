import { sortByField } from "@/lib/utils";

interface UseFilteredDataProps<T> {
  data: T[];
  searchValue: string;
  searchFields: (keyof T)[];
  sortField: keyof T;
  sortOrder: "asc" | "desc";
}

export function useFilteredData<T>({
  data,
  searchValue,
  searchFields,
  sortField,
  sortOrder,
}: UseFilteredDataProps<T>) {

  let processed = data;

  if (searchValue) {
    const lowercasedFilter = searchValue.toLowerCase();
    processed = processed.filter((item) => {
      return searchFields.some((field) => {
        const value = String(item[field] || "");
        return value.toLowerCase().includes(lowercasedFilter);
      });
    });
  }

  return sortByField([...processed], sortField, sortOrder);
}