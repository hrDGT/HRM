"use client";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";

import { createLanguageAction } from "@/components/languages/actions/create-languages-action";
import { CreateLanguageModal } from "@/components/languages/ui/create-language-modal";

jest.mock("next-intl", () => ({
  useTranslations: jest.fn((namespace) => (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      Languages: {
        createButton: "Create language",
        createModalTitle: "Create language",
        "toasts.created": "Language created successfully",
        "validation.nameMin": "Name must be at least 2 characters",
        "validation.isoLength": "ISO2 must be 2 letters",
      },
      Common: {
        "fields.name": "Name",
        "fields.nativeName": "Native name",
        "fields.iso2": "Iso2",
        "actions.create": "Create",
        "actions.creating": "Creating...",
        "actions.cancel": "Cancel",
      },
    };
    return translations[namespace]?.[key] || key;
  }),
}));

jest.mock("@/components/languages/actions/create-languages-action", () => ({
  createLanguageAction: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("CreateLanguageModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("opens modal, fills form, submits successfully and shows toast", async () => {
    const user = userEvent.setup();
    (createLanguageAction as jest.Mock).mockResolvedValue({ success: true });

    render(<CreateLanguageModal />);

    const triggerBtn = screen.getByRole("button", {
      name: /Create language/i,
    });
    await user.click(triggerBtn);

    const nameInput = await screen.findByPlaceholderText("Name");
    await user.type(nameInput, "English");

    const nativeNameInput = screen.getByPlaceholderText("Native name");
    await user.type(nativeNameInput, "English");

    const isoInput = screen.getByPlaceholderText("Iso2");
    await user.type(isoInput, "EN");

    const submitBtn = screen.getByRole("button", { name: "Create" });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(createLanguageAction).toHaveBeenCalledWith(
        "English",
        "EN",
        "English",
      );
      expect(toast.success).toHaveBeenCalledWith(
        "Language created successfully",
      );
    });
  });

  it("shows validation error if name is too short without calling action", async () => {
    const user = userEvent.setup();
    render(<CreateLanguageModal />);

    await user.click(screen.getByRole("button", { name: /Create language/i }));

    const nameInput = await screen.findByPlaceholderText("Name");
    await user.type(nameInput, "A");

    await user.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(
        screen.getByText("Name must be at least 2 characters"),
      ).toBeInTheDocument();

      expect(createLanguageAction).not.toHaveBeenCalled();
    });
  });
});
