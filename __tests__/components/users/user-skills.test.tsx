import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { UserSkills } from "@/app/(protected)/users/[id]/_components/user-skills";
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
  getUserSkills: jest.fn().mockResolvedValue([
    { name: "React", categoryId: "1", categoryName: "Frontend", mastery: "Advanced" },
    { name: "TypeScript", categoryId: "1", categoryName: "Frontend", mastery: "Proficient" },
    { name: "Node.js", categoryId: "2", categoryName: "Backend", mastery: "Competent" },
  ]),
  getAvailableSkills: jest.fn().mockResolvedValue([
    { id: "1", name: "React" },
    { id: "2", name: "TypeScript" },
    { id: "3", name: "Node.js" },
    { id: "4", name: "Python" },
  ]),
  deleteProfileSkills: jest.fn().mockResolvedValue([]),
  addProfileSkill: jest.fn().mockResolvedValue(undefined),
  updateProfileSkill: jest.fn().mockResolvedValue(undefined),
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

jest.mock("@/app/(protected)/users/[id]/_components/skill-modal", () => ({
  SkillModal: ({ open, onClose, mode, onConfirm }: any) =>
    open ? (
      <div data-testid="mock-skill-modal" onClick={onClose}>
        Modal - {mode}
        <button data-testid="modal-confirm" onClick={() => onConfirm?.("TestSkill", "Advanced")}>
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

describe("UserSkills", () => {
  const defaultProps = { userId: 1, canEdit: true };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe.each(locales)("locale: %s", (locale) => {
    const messages = messagesMap[locale];
    const users = messages.Users;

    describe("rendering", () => {
      it("renders loading state initially", () => {
        renderWithLocale(<UserSkills {...defaultProps} />, locale);
        expect(screen.getByTestId("icon-loader")).toBeInTheDocument();
      });

      it("renders skills grouped by category after loading", async () => {
        renderWithLocale(<UserSkills {...defaultProps} />, locale);
        await waitFor(() => {
          expect(screen.getByText("Frontend")).toBeInTheDocument();
          expect(screen.getByText("Backend")).toBeInTheDocument();
          expect(screen.getByText("React")).toBeInTheDocument();
        });
      });

      it("displays category parent name when available", async () => {
        const { getUserSkills } = require("@/app/(protected)/users/[id]/actions");
        getUserSkills.mockResolvedValueOnce([
          { name: "React", categoryId: "1", categoryName: "Frontend", categoryParentName: "Web", mastery: "Advanced" },
        ]);
        renderWithLocale(<UserSkills {...defaultProps} />, locale);
        await waitFor(() => {
          expect(screen.getByText("— Web")).toBeInTheDocument();
        });
      });

      it("shows empty state when no skills", async () => {
        const { getUserSkills } = require("@/app/(protected)/users/[id]/actions");
        getUserSkills.mockResolvedValueOnce([]);
        renderWithLocale(<UserSkills {...defaultProps} />, locale);
        await waitFor(() => {
          expect(screen.getByText(users.noSkills)).toBeInTheDocument();
        });
      });
    });

    describe("edit permissions", () => {
      it("hides action buttons when canEdit is false", async () => {
        renderWithLocale(<UserSkills userId={1} canEdit={false} />, locale);
        await waitFor(() => {
          expect(screen.queryByRole("button", { name: users.addLanguage })).not.toBeInTheDocument();
        });
      });

      it("shows add skill button when canEdit is true", async () => {
        renderWithLocale(<UserSkills {...defaultProps} />, locale);
        await waitFor(() => {
          expect(screen.getByText(users.addSkill)).toBeInTheDocument();
        });
      });
    });

    describe("skill interactions", () => {
      it("opens update modal when clicking a skill (edit mode)", async () => {
        const user = userEvent.setup();
        renderWithLocale(<UserSkills {...defaultProps} />, locale);
        await waitFor(() => screen.getByText("React"));
        await user.click(screen.getByText("React"));
        expect(screen.getByTestId("mock-skill-modal")).toBeInTheDocument();
      });

      it("does not open modal when canEdit is false", async () => {
        const user = userEvent.setup();
        renderWithLocale(<UserSkills userId={1} canEdit={false} />, locale);
        await waitFor(() => screen.getByText("React"));
        await user.click(screen.getByText("React"));
        expect(screen.queryByTestId("mock-skill-modal")).not.toBeInTheDocument();
      });
    });

    describe("add skill flow", () => {
      it("opens add modal when clicking Add Skill button", async () => {
        const user = userEvent.setup();
        renderWithLocale(<UserSkills {...defaultProps} />, locale);
        await waitFor(() => screen.getByText(users.addSkill));
        await user.click(screen.getByText(users.addSkill));
        expect(screen.getByTestId("mock-skill-modal")).toBeInTheDocument();
      });

      it("calls addProfileSkill and reloads on confirm", async () => {
        const user = userEvent.setup();
        renderWithLocale(<UserSkills {...defaultProps} />, locale);
        const { addProfileSkill } = require("@/app/(protected)/users/[id]/actions");

        await waitFor(() => screen.getByText(users.addSkill));
        await user.click(screen.getByText(users.addSkill));
        await user.click(screen.getByTestId("modal-confirm"));

        await waitFor(() => {
          expect(addProfileSkill).toHaveBeenCalledWith(1, "TestSkill", "Advanced");
        });
      });
    });

    describe("delete mode", () => {
      it("enters selection mode when delete button is clicked", async () => {
        const user = userEvent.setup();
        renderWithLocale(<UserSkills {...defaultProps} />, locale);

        await waitFor(() => screen.getByTestId("icon-trash"));
        
        await user.click(screen.getByTestId("icon-trash").closest("button")!);
        
        expect(screen.queryByText(users.cancelSelection)).not.toBeInTheDocument();
        
        await user.click(screen.getByText("React"));
        expect(screen.getByText(users.cancelSelection)).toBeInTheDocument();
      });

      it("selects skills when clicked in selection mode", async () => {
        const user = userEvent.setup();
        renderWithLocale(<UserSkills {...defaultProps} />, locale);

        await waitFor(() => screen.getByTestId("icon-trash"));
        await user.click(screen.getByTestId("icon-trash").closest("button")!);
        await user.click(screen.getByText("React"));

        expect(screen.getByText("1")).toBeInTheDocument();
      });

      it("calls deleteProfileSkills when removing selected", async () => {
        const user = userEvent.setup();
        renderWithLocale(<UserSkills {...defaultProps} />, locale);
        const { deleteProfileSkills } = require("@/app/(protected)/users/[id]/actions");

        await waitFor(() => screen.getByTestId("icon-trash"));
        await user.click(screen.getByTestId("icon-trash").closest("button")!);
        await user.click(screen.getByText("React"));
        await user.click(screen.getByText(users.removeSelected));

        await waitFor(() => {
          expect(deleteProfileSkills).toHaveBeenCalledWith(1, ["React"]);
        });
      });

      it("cancels selection when cancel button is clicked", async () => {
        const user = userEvent.setup();
        renderWithLocale(<UserSkills {...defaultProps} />, locale);

        await waitFor(() => screen.getByTestId("icon-trash"));
        await user.click(screen.getByTestId("icon-trash").closest("button")!);
        
        await user.click(screen.getByText("React"));
        
        await user.click(screen.getByText(users.cancelSelection));

        expect(screen.queryByText(users.cancelSelection)).not.toBeInTheDocument();
      });
    });

    describe("error handling", () => {
      it("displays error message when loading fails", async () => {
        const { getUserSkills } = require("@/app/(protected)/users/[id]/actions");
        getUserSkills.mockRejectedValueOnce(new Error("Failed to load"));
        renderWithLocale(<UserSkills {...defaultProps} />, locale);
        await waitFor(() => {
          expect(screen.getByText("Failed to load")).toBeInTheDocument();
        });
      });
    });
  });
});
