"use client";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";

import { updateLanguageAction } from "@/components/languages/actions/update-languages-action";
import { UpdateLanguageModal } from "@/components/languages/ui/update-language-modal";

jest.mock("next-intl", () => ({
  useTranslations: jest.fn((namespace) => (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      Languages: {
        updateModalTitle: "Update language",
        "toasts.updated": "Language updated successfully",
      },
      Common: {
        "fields.name": "Name",
        "fields.iso2": "Iso2",
        "fields.nativeName": "Native name",
        "actions.update": "Update",
        "actions.cancel": "Cancel",
      },
    };
    return translations[namespace]?.[key] || key;
  }),
}));

jest.mock("@/components/languages/actions/update-languages-action", () => ({
  updateLanguageAction: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("UpdateLanguageModal", () => {
  const mockLanguage = {
    id: "1",
    name: "English",
    iso2: "EN",
    native_name: "EnglishNative",
  };

  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initializes with existing data, submits changes and shows toast", async () => {
    const user = userEvent.setup();
    (updateLanguageAction as jest.Mock).mockResolvedValue({ success: true });

    render(
      <UpdateLanguageModal
        language={mockLanguage}
        open={true}
        onOpenChange={mockOnOpenChange}
      />,
    );

    const nameInput = await screen.findByDisplayValue("English");
    expect(nameInput).toBeInTheDocument();
    await user.clear(nameInput);
    await user.type(nameInput, "British");

    const nativeInput = screen.getByDisplayValue("EnglishNative");
    expect(nativeInput).toBeInTheDocument();
    await user.clear(nativeInput);
    await user.type(nativeInput, "English");

    const isoInput = screen.getByDisplayValue("EN");
    expect(isoInput).toBeInTheDocument();
    await user.clear(isoInput);
    await user.type(isoInput, "GB");

    const submitBtn = screen.getByRole("button", { name: "Update" });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(updateLanguageAction).toHaveBeenCalledWith(
        "1",
        "British",
        "GB",
        "English",
      );
      expect(toast.success).toHaveBeenCalledWith(
        "Language updated successfully",
      );
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
