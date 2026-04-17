"use client";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";

import { updatePositionAction } from "@/components/positions/actions/update-positions-action";
import { UpdatePositionModal } from "@/components/positions/ui/update-position.modal";

jest.mock("next-intl", () => ({
  useTranslations: jest.fn((namespace) => (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      Positions: {
        updateModalTitle: "Update position",
        "toasts.updated": "Position updated successfully",
      },
      Common: {
        "fields.name": "Name",
        "actions.update": "Update",
        "actions.cancel": "Cancel",
      },
    };
    return translations[namespace]?.[key] || key;
  }),
}));

jest.mock("@/components/positions/actions/update-positions-action", () => ({
  updatePositionAction: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("UpdatePositionModal", () => {
  const mockPosition = { id: "1", name: "Test pos" };
  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initializes with existing data, submits changes and shows toast", async () => {
    const user = userEvent.setup();
    (updatePositionAction as jest.Mock).mockResolvedValue({ success: true });

    render(
      <UpdatePositionModal
        position={mockPosition}
        open={true}
        onOpenChange={mockOnOpenChange}
      />,
    );

    const input = await screen.findByDisplayValue("Test pos");
    expect(input).toBeInTheDocument();

    await user.clear(input);
    await user.type(input, "Test pos updated");

    const submitBtn = screen.getByRole("button", { name: "Update" });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(updatePositionAction).toHaveBeenCalledWith(
        "1",
        "Test pos updated",
      );
      expect(toast.success).toHaveBeenCalledWith(
        "Position updated successfully",
      );
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
