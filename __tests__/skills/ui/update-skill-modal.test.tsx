"use client";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";

import { updateSkillAction } from "@/components/skills/actions/update-skills-action";
import { UpdateSkillModal } from "@/components/skills/ui/update-skill-modal";

jest.mock("next-intl", () => ({
  useTranslations: jest.fn((namespace) => (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      Skills: {
        updateModalTitle: "Update skill",
        "toasts.updated": "Skill updated successfully",
      },
      Common: {
        "fields.name": "Name",
        "fields.category": "Category",
        "actions.update": "Update",
        "actions.cancel": "Cancel",
      },
    };
    return translations[namespace]?.[key] || key;
  }),
}));

jest.mock("@/components/skills/actions/update-skills-action", () => ({
  updateSkillAction: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("UpdateSkillModal", () => {
  const mockSkill = {
    id: "1",
    name: "React",
    category: { id: "c1", name: "Frontend" },
  };

  const mockCategoryOptions = [
    { value: "c1", label: "Frontend" },
    { value: "c2", label: "Backend" },
  ];

  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  it("initializes with existing data, submits changes and shows toast", async () => {
    const user = userEvent.setup();
    (updateSkillAction as jest.Mock).mockResolvedValue({ success: true });

    render(
      <UpdateSkillModal
        skill={mockSkill}
        categoryOptions={mockCategoryOptions}
        open={true}
        onOpenChange={mockOnOpenChange}
      />,
    );

    const input = await screen.findByDisplayValue("React");
    expect(input).toBeInTheDocument();

    await user.clear(input);
    await user.type(input, "React Updated");

    const submitBtn = screen.getByRole("button", { name: "Update" });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(updateSkillAction).toHaveBeenCalledWith(
        "1",
        "React Updated",
        "c1",
      );
      expect(toast.success).toHaveBeenCalledWith("Skill updated successfully");
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
