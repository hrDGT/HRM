import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import React from "react";
import { NextIntlClientProvider } from "next-intl";
import messagesEn from "@/messages/en.json";
import messagesDe from "@/messages/de.json";
import messagesRu from "@/messages/ru.json";

const locales = ["en", "de", "ru"] as const;
type Locale = typeof locales[number];

const messagesMap: Record<Locale, any> = {
  en: messagesEn,
  de: messagesDe,
  ru: messagesRu,
};

function renderWithLocale(ui: React.ReactElement, locale: Locale = "en") {
  return render(
    <NextIntlClientProvider locale={locale} messages={messagesMap[locale]}>
      {ui}
    </NextIntlClientProvider>
  );
}

jest.mock("@/components/ui/modal-wrapper", () => ({
  ModalWrapper: ({ children, title, open, onClose }: any) =>
    open ? (
      <div data-testid="mock-modal" role="dialog">
        <h2 data-testid="modal-title">{title}</h2>
        <button data-testid="modal-close" onClick={onClose}>Close</button>
        {children}
      </div>
    ) : null,
}));

jest.mock("lucide-react", () => ({
  Loader2: () => <svg data-testid="icon-loader" className="animate-spin" />,
  ChevronDown: () => <svg data-testid="icon-chevron" />,
}));

const mockAvailableLanguages = [
  { id: "1", name: "English" },
  { id: "2", name: "German" },
  { id: "3", name: "Russian" },
];

describe("LanguageModal", () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe.each(locales)("locale: %s", (locale) => {
    const messages = messagesMap[locale];
    const users = messages.Users;

    describe("rendering", () => {
      it("renders with add title when mode is add", () => {
        const { LanguageModal } = require("@/app/(protected)/users/[id]/_components/language-modal");
        renderWithLocale(
          <LanguageModal
            open
            onClose={mockOnClose}
            mode="add"
            availableLanguages={mockAvailableLanguages}
            onConfirm={mockOnConfirm}
          />,
          locale
        );

        expect(screen.getByTestId("modal-title")).toHaveTextContent(users.languageModal.addTitle);
      });

      it("renders with update title when mode is update", () => {
        const { LanguageModal } = require("@/app/(protected)/users/[id]/_components/language-modal");
        renderWithLocale(
          <LanguageModal
            open
            onClose={mockOnClose}
            mode="update"
            availableLanguages={mockAvailableLanguages}
            initialLanguageName="English"
            initialProficiency="B2"
            onConfirm={mockOnConfirm}
          />,
          locale
        );

        expect(screen.getByTestId("modal-title")).toHaveTextContent(users.languageModal.updateTitle);
      });

      it("renders language select with available options", () => {
        const { LanguageModal } = require("@/app/(protected)/users/[id]/_components/language-modal");
        renderWithLocale(
          <LanguageModal
            open
            onClose={mockOnClose}
            mode="add"
            availableLanguages={mockAvailableLanguages}
            onConfirm={mockOnConfirm}
          />,
          locale
        );

        const select = screen.getByRole("combobox", { name: users.languageModal.language });
        expect(select).toBeInTheDocument();
        expect(screen.getByText("English")).toBeInTheDocument();
        expect(screen.getByText("German")).toBeInTheDocument();
      });

      it("renders proficiency select with all levels", () => {
        const { LanguageModal } = require("@/app/(protected)/users/[id]/_components/language-modal");
        renderWithLocale(
          <LanguageModal
            open
            onClose={mockOnClose}
            mode="add"
            availableLanguages={mockAvailableLanguages}
            onConfirm={mockOnConfirm}
          />,
          locale
        );

        const select = screen.getByRole("combobox", { name: users.languageModal.proficiency });
        expect(select).toBeInTheDocument();
        expect(screen.getByText("A1")).toBeInTheDocument();
        expect(screen.getByText("Native")).toBeInTheDocument();
      });

      it("displays cancel and confirm buttons with correct labels", () => {
        const { LanguageModal } = require("@/app/(protected)/users/[id]/_components/language-modal");
        renderWithLocale(
          <LanguageModal
            open
            onClose={mockOnClose}
            mode="add"
            availableLanguages={mockAvailableLanguages}
            onConfirm={mockOnConfirm}
          />,
          locale
        );

        expect(screen.getByRole("button", { name: users.languageModal.cancel })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: users.languageModal.confirm })).toBeInTheDocument();
      });
    });

    describe("interactions", () => {
      it("calls onClose when cancel button is clicked", async () => {
        const user = userEvent.setup();
        const { LanguageModal } = require("@/app/(protected)/users/[id]/_components/language-modal");
        renderWithLocale(
          <LanguageModal
            open
            onClose={mockOnClose}
            mode="add"
            availableLanguages={mockAvailableLanguages}
            onConfirm={mockOnConfirm}
          />,
          locale
        );

        await user.click(screen.getByRole("button", { name: users.languageModal.cancel }));
        expect(mockOnClose).toHaveBeenCalled();
      });

      it("calls onConfirm with selected values when confirm is clicked", async () => {
        const user = userEvent.setup();
        const { LanguageModal } = require("@/app/(protected)/users/[id]/_components/language-modal");
        renderWithLocale(
          <LanguageModal
            open
            onClose={mockOnClose}
            mode="add"
            availableLanguages={mockAvailableLanguages}
            onConfirm={mockOnConfirm}
          />,
          locale
        );

        const langSelect = screen.getByRole("combobox", { name: users.languageModal.language });
        await user.selectOptions(langSelect, "English");

        const profSelect = screen.getByRole("combobox", { name: users.languageModal.proficiency });
        await user.selectOptions(profSelect, "C1");

        await user.click(screen.getByRole("button", { name: users.languageModal.confirm }));

        await waitFor(() => {
          expect(mockOnConfirm).toHaveBeenCalledWith("English", "C1");
        });
      });

      it("disables confirm button when no language is selected", async () => {
        const user = userEvent.setup();
        const { LanguageModal } = require("@/app/(protected)/users/[id]/_components/language-modal");
        renderWithLocale(
          <LanguageModal
            open
            onClose={mockOnClose}
            mode="add"
            availableLanguages={mockAvailableLanguages}
            onConfirm={mockOnConfirm}
          />,
          locale
        );

        const confirmBtn = screen.getByRole("button", { name: users.languageModal.confirm });
        expect(confirmBtn).toBeDisabled();
      });

      it("disables language select in update mode", () => {
        const { LanguageModal } = require("@/app/(protected)/users/[id]/_components/language-modal");
        renderWithLocale(
          <LanguageModal
            open
            onClose={mockOnClose}
            mode="update"
            availableLanguages={mockAvailableLanguages}
            initialLanguageName="English"
            onConfirm={mockOnConfirm}
          />,
          locale
        );

        const select = screen.getByRole("combobox", { name: users.languageModal.language });
        expect(select).toBeDisabled();
      });
    });

    describe("error handling", () => {
      it("displays error message when onConfirm rejects", async () => {
        const user = userEvent.setup();
        const { LanguageModal } = require("@/app/(protected)/users/[id]/_components/language-modal");
        const mockReject = jest.fn().mockRejectedValue(new Error("Failed"));

        renderWithLocale(
          <LanguageModal
            open
            onClose={mockOnClose}
            mode="add"
            availableLanguages={mockAvailableLanguages}
            onConfirm={mockReject}
          />,
          locale
        );

        const langSelect = screen.getByRole("combobox", { name: users.languageModal.language });
        await user.selectOptions(langSelect, "English");
        await user.click(screen.getByRole("button", { name: users.languageModal.confirm }));

        await waitFor(() => {
          expect(screen.getByText("Failed")).toBeInTheDocument();
        });
      });
    });
  });
});
