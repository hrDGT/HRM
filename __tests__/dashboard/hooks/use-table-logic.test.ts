import { act, renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";

import { useTableLogic } from "@/components/dashboard/hooks/use-table-logic";

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockData = [
  { id: "1", name: "First item", category: "A" },
  { id: "2", name: "Second item", category: "B" },
  { id: "3", name: "Third item", category: "A" },
];

describe("useTableLogic Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initializes with default values and sorted data", () => {
    const { result } = renderHook(() =>
      useTableLogic({
        initialData: mockData,
        isAdmin: true,
        searchFields: ["name"],
        initialSortField: "name",
      })
    );

    expect(result.current.isAdmin).toBe(true);
    expect(result.current.searchValue).toBe("");
    expect(result.current.sortField).toBe("name");

    expect(result.current.filteredData[0].name).toBe("First item");
  });

  it("filters data based on search value across specified fields", () => {
    const { result } = renderHook(() =>
      useTableLogic({
        initialData: mockData,
        isAdmin: true,
        searchFields: ["name", "category"],
        initialSortField: "name",
      })
    );

    act(() => {
      result.current.handleSearchChange({
        target: { value: "Second" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.searchValue).toBe("Second");
    expect(result.current.filteredData).toHaveLength(1);
    expect(result.current.filteredData[0].name).toBe("Second item");
  });

  it("handles successful deletion and shows provided success message", async () => {
    const mockDeleteAction = jest.fn().mockResolvedValue({ success: true });

    const { result } = renderHook(() =>
      useTableLogic({
        initialData: mockData,
        isAdmin: true,
        searchFields: ["name"],
        initialSortField: "name",
        deleteAction: mockDeleteAction,
        deleteSuccessMessage: "Item deleted perfectly",
      })
    );

    act(() => {
      result.current.handleDelete("1");
    });

    await waitFor(() => {
      expect(mockDeleteAction).toHaveBeenCalledWith("1");
      expect(toast.success).toHaveBeenCalledWith("Item deleted perfectly");
    });
  });

  it("handles deletion error and shows error toast from server result", async () => {
    const serverError = "Server-side deletion error";
    const mockDeleteAction = jest.fn().mockResolvedValue({ error: serverError });

    const { result } = renderHook(() =>
      useTableLogic({
        initialData: mockData,
        isAdmin: true,
        searchFields: ["name"],
        initialSortField: "name",
        deleteAction: mockDeleteAction,
      })
    );

    act(() => {
      result.current.handleDelete("2");
    });

    await waitFor(() => {
      expect(mockDeleteAction).toHaveBeenCalledWith("2");
      expect(toast.error).toHaveBeenCalledWith(serverError);
    });
  });
});