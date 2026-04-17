"use client";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";

import { createPositionAction } from "@/components/positions/actions/create-positions-action";
import { CreatePositionModal } from "@/components/positions/ui/create-position-modal";

jest.mock("next-intl", () => ({
  useTranslations: jest.fn((namespace) => (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      Positions: {
        createButton: "Create position",
        createModalTitle: "Create position",
        "toasts.created": "Position created successfully",
        "validation.nameMin": "Name must be at least 2 characters",
      },
      Common: {
        "fields.name": "Name",
        "actions.create": "Create",
        "actions.creating": "Creating...",
        "actions.cancel": "Cancel",
      },
    };
    return translations[namespace]?.[key] || key;
  }),
}));

jest.mock("@/components/positions/actions/create-positions-action", () => ({
  createPositionAction: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("CreatePositionModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("opens modal, fills form, submits successfully and shows toast", async () => {
    const user = userEvent.setup();
    (createPositionAction as jest.Mock).mockResolvedValue({ success: true });

    render(<CreatePositionModal />);

    const triggerBtn = screen.getByRole("button", {
      name: /Create position/i,
    });
    await user.click(triggerBtn);

    const input = await screen.findByPlaceholderText("Name");
    await user.type(input, "New Position");

    const submitBtn = screen.getByRole("button", { name: "Create" });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(createPositionAction).toHaveBeenCalledWith("New Position");
      expect(toast.success).toHaveBeenCalledWith(
        "Position created successfully",
      );
    });
  });

  it("shows validation error if name is too short without calling action", async () => {
    const user = userEvent.setup();
    render(<CreatePositionModal />);

    await user.click(screen.getByRole("button", { name: /Create position/i }));

    const input = await screen.findByPlaceholderText("Name");
    await user.type(input, "A");

    await user.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(
        screen.getByText("Name must be at least 2 characters"),
      ).toBeInTheDocument();
      expect(createPositionAction).not.toHaveBeenCalled();
    });
  });
});
