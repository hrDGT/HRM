"use client";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";

import { updateDepartmentAction } from "@/components/departments/actions/update-departments-action";
import { UpdateDepartmentModal } from "@/components/departments/ui/update-department-modal";

jest.mock("next-intl", () => ({
  useTranslations: jest.fn((namespace) => (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      Departments: {
        updateModalTitle: "Update department",
        "toasts.updated": "Department updated successfully",
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

jest.mock("@/components/departments/actions/update-departments-action", () => ({
  updateDepartmentAction: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("UpdateDepartmentModal", () => {
  const mockDepartment = { id: "1", name: "Test dep" };
  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initializes with existing data, submits changes and shows toast", async () => {
    const user = userEvent.setup();
    (updateDepartmentAction as jest.Mock).mockResolvedValue({ success: true });

    render(
      <UpdateDepartmentModal
        department={mockDepartment}
        open={true}
        onOpenChange={mockOnOpenChange}
      />,
    );

    const input = await screen.findByDisplayValue("Test dep");
    expect(input).toBeInTheDocument();

    await user.clear(input);
    await user.type(input, "Test dep updated");

    const submitBtn = screen.getByRole("button", { name: "Update" });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(updateDepartmentAction).toHaveBeenCalledWith(
        "1",
        "Test dep updated",
      );
      expect(toast.success).toHaveBeenCalledWith(
        "Department updated successfully",
      );
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
