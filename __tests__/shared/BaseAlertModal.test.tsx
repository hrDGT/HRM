"use client";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { BaseAlertModal } from "@/components/ui/base-alert-modal";

jest.mock("next-intl", () => ({
  useTranslations: jest.fn(() => (key: string) => {
    const messages: Record<string, string> = {
      "actions.cancel": "Cancel",
      "actions.confirm": "Confirm",
      "actions.confirming": "Confirming...",
    };
    return messages[key] || key;
  }),
}));

describe("BaseAlertModal", () => {
  const mockOnConfirm = jest.fn();
  const mockOnOpenChange = jest.fn();

  const defaultProps = {
    title: "Delete Item",
    description: "Are you sure you want to delete",
    itemName: "Test Item",
    isPending: false,
    open: true,
    onOpenChange: mockOnOpenChange,
    onConfirm: mockOnConfirm,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with provided title, description, and item name", () => {
    render(<BaseAlertModal {...defaultProps} />);

    expect(screen.getByText("Delete Item")).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to delete/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Test Item")).toBeInTheDocument();
  });

  it("calls onConfirm when the confirm button is clicked", async () => {
    const user = userEvent.setup();
    render(<BaseAlertModal {...defaultProps} confirmText="Yes, delete it" />);

    const confirmBtn = screen.getByRole("button", { name: "Yes, delete it" });
    await user.click(confirmBtn);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onOpenChange(false) when cancel button is clicked", async () => {
    const user = userEvent.setup();
    render(<BaseAlertModal {...defaultProps} />);

    const cancelBtn = screen.getByRole("button", { name: "Cancel" });
    await user.click(cancelBtn);

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it("disables buttons and shows confirmingText when isPending is true", () => {
    render(
      <BaseAlertModal
        {...defaultProps}
        isPending={true}
        confirmingText="Deleting in progress..."
      />,
    );

    const cancelBtn = screen.getByRole("button", { name: "Cancel" });
    const confirmBtn = screen.getByRole("button", {
      name: "Deleting in progress...",
    });

    expect(cancelBtn).toBeDisabled();
    expect(confirmBtn).toBeDisabled();
  });
});
