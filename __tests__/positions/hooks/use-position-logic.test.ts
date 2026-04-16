import { act, renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";

import { deletePositionAction } from "@/components/positions/actions/delete-positions-action";
import { usePositionsLogic } from "@/components/positions/hooks/use-positions-logic";


jest.mock("next-intl", () => ({
  useTranslations: jest.fn(() => (key: string) => {
    const messages: Record<string, string> = {
      "toasts.deleted": "Position deleted successfully",
      "title": "Positions"
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

jest.mock("@/components/positions/actions/delete-positions-action", () => ({
  deletePositionAction: jest.fn(),
}));

const mockData = [
  { id: "1", name: "First test pos" },
  { id: "2", name: "Second test pos" },
  { id: "3", name: "Third test pos" },
];

describe("usePositionsLogic Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initializes with default values and sorted data", () => {
    const { result } = renderHook(() => usePositionsLogic(mockData, true));

    expect(result.current.isAdmin).toBe(true);
    expect(result.current.searchValue).toBe("");
    expect(result.current.sortField).toBe("name");

    expect(result.current.filteredPositions[0].name).toBe("First test pos");
  });

  it("filters data based on search value", () => {
    const { result } = renderHook(() => usePositionsLogic(mockData, true));

    act(() => {
      result.current.handleSearchChange({
        target: { value: "Second test pos" }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.searchValue).toBe("Second test pos");
    expect(result.current.filteredPositions).toHaveLength(1);
    expect(result.current.filteredPositions[0].name).toBe("Second test pos");
  });

  it("handles successful deletion and shows localized success toast", async () => {
    (deletePositionAction as jest.Mock).mockResolvedValue({ success: true });

    const { result } = renderHook(() => usePositionsLogic(mockData, true));

    act(() => {
      result.current.handleDelete("1");
    });

    await waitFor(() => {
      expect(deletePositionAction).toHaveBeenCalledWith("1");
      expect(toast.success).toHaveBeenCalledWith("Position deleted successfully");
    });
  });

  it("handles deletion error and shows error toast from server", async () => {
    const serverError = "Server-side deletion error";
    (deletePositionAction as jest.Mock).mockResolvedValue({ error: serverError });

    const { result } = renderHook(() => usePositionsLogic(mockData, true));

    act(() => {
      result.current.handleDelete("2");
    });

    await waitFor(() => {
      expect(deletePositionAction).toHaveBeenCalledWith("2");
      expect(toast.error).toHaveBeenCalledWith(serverError);
    });
  });
});