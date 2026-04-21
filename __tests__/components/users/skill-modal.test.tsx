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

const mockAvailableSkills = [
  { id: "1", name: "React" },
  { id: "2", name: "TypeScript" },
  { id: "3", name: "Node.js" },
];

describe("SkillModal", () => {
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
        const { SkillModal } = require("@/app/(protected)/users/[id]/_components/skill-modal");
        renderWithLocale(
          <SkillModal
            open
            onClose={mockOnClose}
            mode="add"
            availableSkills={mockAvailableSkills}
            onConfirm={mockOnConfirm}
          />,
          locale
        );

        expect(screen.getByTestId("modal-title")).toHaveTextContent(users.skillModal.addTitle);
      });

      it("renders with update title when mode is update", () => {
        const { SkillModal } = require("@/app/(protected)/users/[id]/_components/skill-modal");
        renderWithLocale(
          <SkillModal
            open
            onClose={mockOnClose}
            mode="update"
            availableSkills={mockAvailableSkills}
            initialSkillName="React"
            initialMastery="Advanced"
            onConfirm={mockOnConfirm}
          />,
          locale
        );

        expect(screen.getByTestId("modal-title")).toHaveTextContent(users.skillModal.updateTitle);
      });

      it("renders skill select with available options", () => {
        const { SkillModal } = require("@/app/(protected)/users/[id]/_components/skill-modal");
        renderWithLocale(
          <SkillModal
            open
            onClose={mockOnClose}
            mode="add"
            availableSkills={mockAvailableSkills}
            onConfirm={mockOnConfirm}
          />,
          locale
        );

        const select = screen.getByRole("combobox", { name: users.skillModal.skill });
        expect(select).toBeInTheDocument();
        expect(screen.getByText("React")).toBeInTheDocument();
        expect(screen.getByText("TypeScript")).toBeInTheDocument();
      });

      it("renders mastery select with all levels", () => {
        const { SkillModal } = require("@/app/(protected)/users/[id]/_components/skill-modal");
        renderWithLocale(
          <SkillModal
            open
            onClose={mockOnClose}
            mode="add"
            availableSkills={mockAvailableSkills}
            onConfirm={mockOnConfirm}
          />,
          locale
        );

        const select = screen.getByRole("combobox", { name: users.skillModal.mastery });
        expect(select).toBeInTheDocument();
        expect(screen.getByText("Novice")).toBeInTheDocument();
        expect(screen.getByText("Expert")).toBeInTheDocument();
      });

      it("displays cancel and confirm buttons with correct labels", () => {
        const { SkillModal } = require("@/app/(protected)/users/[id]/_components/skill-modal");
        renderWithLocale(
          <SkillModal
            open
            onClose={mockOnClose}
            mode="add"
            availableSkills={mockAvailableSkills}
            onConfirm={mockOnConfirm}
          />,
          locale
        );

        expect(screen.getByRole("button", { name: users.skillModal.cancel })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: users.skillModal.confirm })).toBeInTheDocument();
      });
    });

    describe("interactions", () => {
      it("calls onClose when cancel button is clicked", async () => {
        const user = userEvent.setup();
        const { SkillModal } = require("@/app/(protected)/users/[id]/_components/skill-modal");
        renderWithLocale(
          <SkillModal
            open
            onClose={mockOnClose}
            mode="add"
            availableSkills={mockAvailableSkills}
            onConfirm={mockOnConfirm}
          />,
          locale
        );

        await user.click(screen.getByRole("button", { name: users.skillModal.cancel }));
        expect(mockOnClose).toHaveBeenCalled();
      });

      it("calls onConfirm with selected values when confirm is clicked", async () => {
        const user = userEvent.setup();
        const { SkillModal } = require("@/app/(protected)/users/[id]/_components/skill-modal");
        renderWithLocale(
          <SkillModal
            open
            onClose={mockOnClose}
            mode="add"
            availableSkills={mockAvailableSkills}
            onConfirm={mockOnConfirm}
          />,
          locale
        );

        const skillSelect = screen.getByRole("combobox", { name: users.skillModal.skill });
        await user.selectOptions(skillSelect, "React");

        const masterySelect = screen.getByRole("combobox", { name: users.skillModal.mastery });
        await user.selectOptions(masterySelect, "Advanced");

        await user.click(screen.getByRole("button", { name: users.skillModal.confirm }));

        await waitFor(() => {
          expect(mockOnConfirm).toHaveBeenCalledWith("React", "Advanced");
        });
      });

      it("disables confirm button when no skill is selected", async () => {
        const user = userEvent.setup();
        const { SkillModal } = require("@/app/(protected)/users/[id]/_components/skill-modal");
        renderWithLocale(
          <SkillModal
            open
            onClose={mockOnClose}
            mode="add"
            availableSkills={mockAvailableSkills}
            onConfirm={mockOnConfirm}
          />,
          locale
        );

        const confirmBtn = screen.getByRole("button", { name: users.skillModal.confirm });
        expect(confirmBtn).toBeDisabled();
      });

      it("disables skill select in update mode", () => {
        const { SkillModal } = require("@/app/(protected)/users/[id]/_components/skill-modal");
        renderWithLocale(
          <SkillModal
            open
            onClose={mockOnClose}
            mode="update"
            availableSkills={mockAvailableSkills}
            initialSkillName="React"
            onConfirm={mockOnConfirm}
          />,
          locale
        );

        const select = screen.getByRole("combobox", { name: users.skillModal.skill });
        expect(select).toBeDisabled();
      });
    });

    describe("error handling", () => {
      it("displays error message when onConfirm rejects", async () => {
        const user = userEvent.setup();
        const { SkillModal } = require("@/app/(protected)/users/[id]/_components/skill-modal");
        const mockReject = jest.fn().mockRejectedValue(new Error("Failed"));

        renderWithLocale(
          <SkillModal
            open
            onClose={mockOnClose}
            mode="add"
            availableSkills={mockAvailableSkills}
            onConfirm={mockReject}
          />,
          locale
        );

        const skillSelect = screen.getByRole("combobox", { name: users.skillModal.skill });
        await user.selectOptions(skillSelect, "React");
        await user.click(screen.getByRole("button", { name: users.skillModal.confirm }));

        await waitFor(() => {
          expect(screen.getByText("Failed")).toBeInTheDocument();
        });
      });
    });
  });
});
