import { act, renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";

import { deleteDepartmentAction } from "@/components/departments/actions/delete-departments-action";
import { useDepartmentsLogic } from "@/components/departments/hooks/use-department-logic";

jest.mock("next-intl", () => ({
  useTranslations: jest.fn(() => (key: string) => {
    const messages: Record<string, string> = {
      "toasts.deleted": "Department deleted successfully",
      "title": "Departments"
    };
    return messages[key] || key;
  }),
}));

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
  { id: "1", name: "First test dep" },
  { id: "2", name: "Second test dep" },
  { id: "3", name: "Third test dep" },
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

    expect(result.current.filteredDepartments[0].name).toBe("First test dep");
  });

  it("filters data based on search value", () => {
    const { result } = renderHook(() => useDepartmentsLogic(mockData, true));

    act(() => {
      result.current.handleSearchChange({
        target: { value: "Second test dep" }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.searchValue).toBe("Second test dep");
    expect(result.current.filteredDepartments).toHaveLength(1);
    expect(result.current.filteredDepartments[0].name).toBe("Second test dep");
  });

  it("handles successful deletion and shows localized success toast", async () => {
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

  it("handles deletion error and shows error toast from server", async () => {
    const serverError = "Server-side deletion error";
    (deleteDepartmentAction as jest.Mock).mockResolvedValue({ error: serverError });

    const { result } = renderHook(() => useDepartmentsLogic(mockData, true));

    act(() => {
      result.current.handleDelete("2");
    });

    await waitFor(() => {
      expect(deleteDepartmentAction).toHaveBeenCalledWith("2");
      expect(toast.error).toHaveBeenCalledWith(serverError);
    });
  });
});