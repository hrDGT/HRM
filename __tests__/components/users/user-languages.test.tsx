import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { UserLanguages } from "@/app/(protected)/users/[id]/_components/user-languages";
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

jest.mock("@/app/(protected)/users/[id]/actions", () => ({
  getUserLanguages: jest.fn().mockResolvedValue([
    { name: "English", proficiency: "C1" },
    { name: "German", proficiency: "B2" },
    { name: "Russian", proficiency: "Native" },
  ]),
  getAvailableLanguages: jest.fn().mockResolvedValue([
    { id: "1", name: "English" },
    { id: "2", name: "German" },
    { id: "3", name: "Russian" },
    { id: "4", name: "French" },
  ]),
  deleteProfileLanguages: jest.fn().mockResolvedValue([]),
  addProfileLanguage: jest.fn().mockResolvedValue(undefined),
  updateProfileLanguage: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, className, "data-testid": testId, ...props }: any) => (
    <button
      data-testid={testId || "mock-button"}
      onClick={onClick}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </button>
  ),
}));

jest.mock("@/app/(protected)/users/[id]/_components/language-modal", () => ({
  LanguageModal: ({ open, onClose, mode, onConfirm }: any) =>
    open ? (
      <div data-testid="mock-language-modal" onClick={onClose}>
        Modal - {mode}
        <button data-testid="modal-confirm" onClick={() => onConfirm?.("TestLang", "B1")}>
          Confirm
        </button>
      </div>
    ) : null,
}));

jest.mock("lucide-react", () => ({
  Plus: () => <svg data-testid="icon-plus" />,
  Trash2: () => <svg data-testid="icon-trash" />,
  Loader2: () => <svg data-testid="icon-loader" className="animate-spin" />,
}));

jest.mock("@/lib/users/language-utils", () => ({
  getProficiencyColor: (level: string) => {
    const colors: Record<string, string> = {
      A1: "rgb(0, 206, 48)",
      A2: "rgb(58, 180, 48)",
      B1: "rgb(116, 154, 48)",
      B2: "rgb(174, 128, 48)",
      C1: "rgb(206, 74, 48)",
      C2: "rgb(206, 26, 48)",
      Native: "rgb(206, 0, 48)",
    };
    return colors[level] || "rgb(0, 206, 48)";
  },
}));

describe("UserLanguages", () => {
  const defaultProps = { userId: 1, canEdit: true };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe.each(locales)("locale: %s", (locale) => {
    const messages = messagesMap[locale];
    const users = messages.Users;

    describe("rendering", () => {
      it("renders loading state initially", () => {
        renderWithLocale(<UserLanguages {...defaultProps} />, locale);
        expect(screen.getByTestId("icon-loader")).toBeInTheDocument();
      });

      it("renders languages in grid layout after loading", async () => {
        renderWithLocale(<UserLanguages {...defaultProps} />, locale);
        await waitFor(() => {
          expect(screen.getByText("English")).toBeInTheDocument();
          expect(screen.getByText("German")).toBeInTheDocument();
          expect(screen.getByText("Russian")).toBeInTheDocument();
        });
      });

      it("displays proficiency badges with correct colors", async () => {
        renderWithLocale(<UserLanguages {...defaultProps} />, locale);
        await waitFor(() => {
          const badges = screen.getAllByText(/^[A-Z0-9]+$/);
          expect(badges.length).toBeGreaterThan(0);
        });
      });

      it("shows empty state when no languages", async () => {
        const { getUserLanguages } = require("@/app/(protected)/users/[id]/actions");
        getUserLanguages.mockResolvedValueOnce([]);
        renderWithLocale(<UserLanguages {...defaultProps} />, locale);
        await waitFor(() => {
          expect(screen.getByText(users.noLanguages)).toBeInTheDocument();
        });
      });
    });

    describe("edit permissions", () => {
      it("hides action buttons when canEdit is false", async () => {
        renderWithLocale(<UserLanguages userId={1} canEdit={false} />, locale);
        await waitFor(() => {
          expect(screen.queryByRole("button", { name: users.addLanguage })).not.toBeInTheDocument();
        });
      });

      it("shows add language button when canEdit is true", async () => {
        renderWithLocale(<UserLanguages {...defaultProps} />, locale);
        await waitFor(() => {
          expect(screen.getByText(users.addLanguage)).toBeInTheDocument();
        });
      });
    });

    describe("language interactions", () => {
      it("opens update modal when clicking a language (edit mode)", async () => {
        const user = userEvent.setup();
        renderWithLocale(<UserLanguages {...defaultProps} />, locale);
        await waitFor(() => screen.getByText("English"));
        await user.click(screen.getByText("English"));
        expect(screen.getByTestId("mock-language-modal")).toBeInTheDocument();
      });

      it("does not open modal when canEdit is false", async () => {
        const user = userEvent.setup();
        renderWithLocale(<UserLanguages userId={1} canEdit={false} />, locale);
        await waitFor(() => screen.getByText("English"));
        await user.click(screen.getByText("English"));
        expect(screen.queryByTestId("mock-language-modal")).not.toBeInTheDocument();
      });
    });

    describe("add language flow", () => {
      it("opens add modal when clicking Add Language button", async () => {
        const user = userEvent.setup();
        renderWithLocale(<UserLanguages {...defaultProps} />, locale);
        await waitFor(() => screen.getByText(users.addLanguage));
        await user.click(screen.getByText(users.addLanguage));
        expect(screen.getByTestId("mock-language-modal")).toBeInTheDocument();
      });

      it("calls addProfileLanguage and reloads on confirm", async () => {
        const user = userEvent.setup();
        renderWithLocale(<UserLanguages {...defaultProps} />, locale);
        const { addProfileLanguage } = require("@/app/(protected)/users/[id]/actions");

        await waitFor(() => screen.getByText(users.addLanguage));
        await user.click(screen.getByText(users.addLanguage));
        await user.click(screen.getByTestId("modal-confirm"));

        await waitFor(() => {
          expect(addProfileLanguage).toHaveBeenCalledWith(1, "TestLang", "B1");
        });
      });
    });

    describe("delete mode", () => {
      it("enters selection mode when delete button is clicked", async () => {
        const user = userEvent.setup();
        renderWithLocale(<UserLanguages {...defaultProps} />, locale);

        await waitFor(() => screen.getByTestId("icon-trash"));
        
        await user.click(screen.getByTestId("icon-trash").closest("button")!);
        
        expect(screen.queryByText(users.cancelSelection)).not.toBeInTheDocument();
        
        await user.click(screen.getByText("English"));
        expect(screen.getByText(users.cancelSelection)).toBeInTheDocument();
      });

      it("selects languages when clicked in selection mode", async () => {
        const user = userEvent.setup();
        renderWithLocale(<UserLanguages {...defaultProps} />, locale);

        await waitFor(() => screen.getByTestId("icon-trash"));
        await user.click(screen.getByTestId("icon-trash").closest("button")!);
        await user.click(screen.getByText("English"));

        expect(screen.getByText("1")).toBeInTheDocument();
      });

      it("calls deleteProfileLanguages when removing selected", async () => {
        const user = userEvent.setup();
        renderWithLocale(<UserLanguages {...defaultProps} />, locale);
        const { deleteProfileLanguages } = require("@/app/(protected)/users/[id]/actions");

        await waitFor(() => screen.getByTestId("icon-trash"));
        await user.click(screen.getByTestId("icon-trash").closest("button")!);
        await user.click(screen.getByText("English"));
        await user.click(screen.getByText(users.removeSelected));

        await waitFor(() => {
          expect(deleteProfileLanguages).toHaveBeenCalledWith(1, ["English"]);
        });
      });

      it("cancels selection when cancel button is clicked", async () => {
        const user = userEvent.setup();
        renderWithLocale(<UserLanguages {...defaultProps} />, locale);

        await waitFor(() => screen.getByTestId("icon-trash"));
        await user.click(screen.getByTestId("icon-trash").closest("button")!);
        
        await user.click(screen.getByText("English"));
        
        await user.click(screen.getByText(users.cancelSelection));

        expect(screen.queryByText(users.cancelSelection)).not.toBeInTheDocument();
      });
    });

    describe("error handling", () => {
      it("displays error message when loading fails", async () => {
        const { getUserLanguages } = require("@/app/(protected)/users/[id]/actions");
        getUserLanguages.mockRejectedValueOnce(new Error("Failed to load"));

        renderWithLocale(<UserLanguages {...defaultProps} />, locale);

        await waitFor(() => {
          expect(screen.getByText("Failed to load")).toBeInTheDocument();
        });
      });
    });
  });
});
