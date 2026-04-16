"use client";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";

import { createDepartmentAction } from "@/components/departments/actions/create-departments-action";
import { CreateDepartmentModal } from "@/components/departments/ui/create-department-modal";

jest.mock("next-intl", () => ({
  useTranslations: jest.fn((namespace) => (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      Departments: {
        createButton: "Create department",
        createModalTitle: "Create department",
        "toasts.created": "Department created successfully",
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

jest.mock("@/components/departments/actions/create-departments-action", () => ({
  createDepartmentAction: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("CreateDepartmentModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("opens modal, fills form, submits successfully and shows toast", async () => {
    const user = userEvent.setup();
    (createDepartmentAction as jest.Mock).mockResolvedValue({ success: true });

    render(<CreateDepartmentModal />);

    const triggerBtn = screen.getByRole("button", {
      name: /Create department/i,
    });
    await user.click(triggerBtn);

    const input = await screen.findByPlaceholderText("Name");
    await user.type(input, "New Department");

    const submitBtn = screen.getByRole("button", { name: "Create" });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(createDepartmentAction).toHaveBeenCalledWith("New Department");
      expect(toast.success).toHaveBeenCalledWith(
        "Department created successfully",
      );
    });
  });

  it("shows validation error if name is too short without calling action", async () => {
    const user = userEvent.setup();
    render(<CreateDepartmentModal />);

    await user.click(
      screen.getByRole("button", { name: /Create department/i }),
    );

    const input = await screen.findByPlaceholderText("Name");
    await user.type(input, "A");

    await user.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(
        screen.getByText("Name must be at least 2 characters"),
      ).toBeInTheDocument();
      expect(createDepartmentAction).not.toHaveBeenCalled();
    });
  });
});
