"use client";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";

import { createSkillAction } from "@/components/skills/actions/create-skills-action";
import { CreateSkillModal } from "@/components/skills/ui/create-skill-modal";

jest.mock("next-intl", () => ({
  useTranslations: jest.fn((namespace) => (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      Skills: {
        createButton: "Create skill",
        createModalTitle: "Create skill",
        "toasts.created": "Skill created successfully",
        "validation.nameMin": "Name must be at least 2 characters",
        "validation.categoryRequired": "Please select a category",
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

jest.mock("@/components/skills/actions/create-skills-action", () => ({
  createSkillAction: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("CreateSkillModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  it("opens modal, fills form, submits successfully and shows toast", async () => {
    const user = userEvent.setup();
    (createSkillAction as jest.Mock).mockResolvedValue({ success: true });

    render(
      <CreateSkillModal
        categoryOptions={[{ label: "Programming languages", value: "1" }]}
      />,
    );

    const triggerBtn = screen.getByRole("button", {
      name: /Create skill/i,
    });
    await user.click(triggerBtn);

    const input = await screen.findByPlaceholderText("Name");
    await user.type(input, "New Skill");

    const triggerSelect = screen.getByRole("combobox");
    triggerSelect.focus();

    await user.keyboard("{ArrowDown}");

    await screen.findByRole("option", { name: "Programming languages" });

    await user.keyboard("{Enter}");

    const submitBtn = screen.getByRole("button", { name: "Create" });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(createSkillAction).toHaveBeenCalledWith("New Skill", "1");
      expect(toast.success).toHaveBeenCalledWith("Skill created successfully");
    });
  });

  it("shows validation error if name is too short without calling action", async () => {
    const user = userEvent.setup();
    render(
      <CreateSkillModal
        categoryOptions={[{ label: "Programming languages", value: "1" }]}
      />,
    );

    await user.click(screen.getByRole("button", { name: /Create skill/i }));

    const input = await screen.findByPlaceholderText("Name");
    await user.type(input, "A");

    await user.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(
        screen.getByText("Name must be at least 2 characters"),
      ).toBeInTheDocument();
      expect(createSkillAction).not.toHaveBeenCalled();
    });
  });

  it("shows validation error if category doesn't select without calling action", async () => {
    const user = userEvent.setup();
    render(
      <CreateSkillModal
        categoryOptions={[{ label: "Programming languages", value: "1" }]}
      />,
    );

    await user.click(screen.getByRole("button", { name: /Create skill/i }));

    const input = await screen.findByPlaceholderText("Name");
    await user.type(input, "Test");

    const submitBtn = screen.getByRole("button", { name: "Create" });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Please select a category")).toBeInTheDocument();
      expect(createSkillAction).not.toHaveBeenCalled();
    });
  });
});
