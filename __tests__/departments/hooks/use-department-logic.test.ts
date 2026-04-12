import { act, renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";

import { deleteDepartmentAction } from "@/components/departments/actions/delete-departments-action";
import { useDepartmentsLogic } from "@/components/departments/hooks/use-department-logic";

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("@/components/departments/actions/delete-departments-action", () => ({
  deleteDepartmentAction: jest.fn(),
}));

const mockData = [
  { id: "1", name: "Sales" },
  { id: "2", name: "HR" },
  { id: "3", name: "IT" },
];

describe("useDepartmentsLogic Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initializes with default values and sorted data", () => {
    const { result } = renderHook(() => useDepartmentsLogic(mockData, true));

    expect(result.current.isAdmin).toBe(true);
    expect(result.current.searchValue).toBe("");
    expect(result.current.sortField).toBe("name");

    expect(result.current.filteredDepartments[0].name).toBe("HR");
    expect(result.current.filteredDepartments[1].name).toBe("IT");
    expect(result.current.filteredDepartments[2].name).toBe("Sales");
  });

  it("filters data based on search value", () => {
    const { result } = renderHook(() => useDepartmentsLogic(mockData, true));

    act(() => {
      result.current.handleSearchChange({ target: { value: "it" } } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.searchValue).toBe("it");
    expect(result.current.filteredDepartments).toHaveLength(1);
    expect(result.current.filteredDepartments[0].name).toBe("IT");
  });

  it("handles successful deletion and shows success toast", async () => {
    (deleteDepartmentAction as jest.Mock).mockResolvedValue({ success: true });

    const { result } = renderHook(() => useDepartmentsLogic(mockData, true));

    act(() => {
      result.current.handleDelete("1");
    });

    await waitFor(() => {
      expect(deleteDepartmentAction).toHaveBeenCalledWith("1");
      expect(toast.success).toHaveBeenCalledWith("Department deleted successfully");
    });
  });

  it("handles deletion error and shows error toast", async () => {
    (deleteDepartmentAction as jest.Mock).mockResolvedValue({ error: "Cannot delete department" });

    const { result } = renderHook(() => useDepartmentsLogic(mockData, true));

    act(() => {
      result.current.handleDelete("2");
    });

    await waitFor(() => {
      expect(deleteDepartmentAction).toHaveBeenCalledWith("2");
      expect(toast.error).toHaveBeenCalledWith("Cannot delete department");
    });
  });
});