import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { CreateUserModal } from "@/app/(protected)/users/_components/create-user-modal";
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

jest.mock("@/components/ui/input", () => ({
  Input: ({ value, onChange, placeholder, className, type = "text", ...props }: any) => (
    <input data-testid="mock-input" value={value ?? ""} onChange={onChange} placeholder={placeholder} className={className} type={type} {...props} />
  ),
}));

jest.mock("@/components/ui/label", () => ({
  Label: ({ children, className, ...props }: any) => (
    <label data-testid="mock-label" className={className} {...props}>
      {children}
    </label>
  ),
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, variant, className, ...props }: any) => (
    <button data-testid="mock-button" data-variant={variant} onClick={onClick} disabled={disabled} className={className} {...props}>
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/select", () => {
  const SelectContext = React.createContext<string | undefined>(undefined);
  return {
    Select: ({ value, onValueChange, children, disabled, ...props }: any) => (
      <SelectContext.Provider value={value}>
        <div data-testid="mock-select-wrapper" data-value={value} data-disabled={disabled} {...props}>
          {children}
        </div>
      </SelectContext.Provider>
    ),
    SelectContent: ({ children, className, ...props }: any) => (
      <div data-testid="mock-select-content" className={className} role="listbox" {...props}>
        {children}
      </div>
    ),
    SelectItem: ({ children, value, className, ...props }: any) => (
      <div data-testid={`mock-select-item-${value}`} data-value={value} className={className} role="option" {...props}>
        {children}
      </div>
    ),
    SelectTrigger: ({ children, className, ...props }: any) => (
      <button data-testid="mock-select-trigger" className={className} type="button" {...props}>
        {children}
      </button>
    ),
    SelectValue: ({ placeholder, ...props }: any) => {
      const value = React.useContext(SelectContext);
      return <span data-testid="mock-select-value" {...props}>{value || placeholder}</span>;
    },
  };
});

jest.mock("@/components/ui/modal-wrapper", () => ({
  ModalWrapper: ({ open, onClose, title, children }: any) =>
    open ? (
      <div data-testid="mock-modal" data-title={title}>
        <button data-testid="mock-modal-close" onClick={onClose}>Close</button>
        {children}
      </div>
    ) : null,
}));

const mockDepartments = [
  { id: "1", name: "React" },
  { id: "2", name: ".NET" },
];

const mockPositions = [
  { id: "10", name: "Software Engineer" },
  { id: "11", name: "DevOps Engineer" },
];

const mockOnClose = jest.fn();
const mockOnCreate = jest.fn();

const defaultProps = {
  open: true,
  onClose: mockOnClose,
  onCreate: mockOnCreate,
  departments: mockDepartments,
  positions: mockPositions,
};

describe("CreateUserModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOnCreate.mockResolvedValue(true);
  });

  describe.each(locales)("locale: %s", (locale) => {
    const messages = messagesMap[locale];
    const users = messages.Users;
    const common = messages.Common;

    describe("modal rendering", () => {
      it("renders modal with correct title", () => {
        renderWithLocale(<CreateUserModal {...defaultProps} />, locale);
        expect(screen.getByTestId("mock-modal")).toHaveAttribute("data-title", users.createModalTitle);
      });

      it("renders all form fields", () => {
        renderWithLocale(<CreateUserModal {...defaultProps} />, locale);
        const inputs = screen.getAllByTestId("mock-input");
        expect(inputs).toHaveLength(4);
        expect(screen.getAllByTestId("mock-select-wrapper")).toHaveLength(3);
      });

      it("shows empty form fields by default", () => {
        renderWithLocale(<CreateUserModal {...defaultProps} />, locale);
        const inputs = screen.getAllByTestId("mock-input");
        expect(inputs[0]).toHaveValue("");
        expect(inputs[1]).toHaveValue("");
        expect(inputs[2]).toHaveValue("");
        expect(inputs[3]).toHaveValue("");
      });

      it("displays field labels in correct locale", () => {
        renderWithLocale(<CreateUserModal {...defaultProps} />, locale);
        const labels = screen.getAllByTestId("mock-label");
        expect(labels[0]).toHaveTextContent(common.fields.email);
        expect(labels[1]).toHaveTextContent(common.fields.password);
        expect(labels[2]).toHaveTextContent(common.fields.firstName);
        expect(labels[3]).toHaveTextContent(common.fields.lastName);
      });
    });

    describe("form interactions", () => {
      it("updates email when changed", async () => {
        const user = userEvent.setup();
        renderWithLocale(<CreateUserModal {...defaultProps} />, locale);
        const inputs = screen.getAllByTestId("mock-input");
        await user.type(inputs[0], "test@example.com");
        expect(inputs[0]).toHaveValue("test@example.com");
      });

      it("updates first and last name when changed", async () => {
        const user = userEvent.setup();
        renderWithLocale(<CreateUserModal {...defaultProps} />, locale);
        const inputs = screen.getAllByTestId("mock-input");
        await user.type(inputs[2], "John");
        await user.type(inputs[3], "Doe");
        expect(inputs[2]).toHaveValue("John");
        expect(inputs[3]).toHaveValue("Doe");
      });

      it("allows setting a password", async () => {
        const user = userEvent.setup();
        renderWithLocale(<CreateUserModal {...defaultProps} />, locale);
        const inputs = screen.getAllByTestId("mock-input");
        await user.type(inputs[1], "securePass123");
        expect(inputs[1]).toHaveValue("securePass123");
      });
    });

    describe("select fields", () => {
      it("displays first department as default selected", () => {
        renderWithLocale(<CreateUserModal {...defaultProps} />, locale);
        const wrappers = screen.getAllByTestId("mock-select-wrapper");
        expect(wrappers[0]).toHaveAttribute("data-value", "1");
      });

      it("displays first position as default selected", () => {
        renderWithLocale(<CreateUserModal {...defaultProps} />, locale);
        const wrappers = screen.getAllByTestId("mock-select-wrapper");
        expect(wrappers[1]).toHaveAttribute("data-value", "10");
      });

      it("includes only Employee and Admin roles in options", () => {
        renderWithLocale(<CreateUserModal {...defaultProps} />, locale);
        const selectContents = screen.getAllByTestId("mock-select-content");
        const roleContent = selectContents[2];
        const items = Array.from(roleContent.querySelectorAll('[data-testid^="mock-select-item-"]'));
        const itemTexts = items.map((item: Element) => item.textContent);
        expect(itemTexts).toContain("Employee");
        expect(itemTexts).toContain("Admin");
        expect(itemTexts).not.toContain("Manager");
      });

      it("displays select labels in correct locale", () => {
        renderWithLocale(<CreateUserModal {...defaultProps} />, locale);
        const labels = screen.getAllByTestId("mock-label");
        expect(labels[4]).toHaveTextContent(common.fields.department);
        expect(labels[5]).toHaveTextContent(common.fields.position);
        expect(labels[6]).toHaveTextContent(common.fields.role);
      });
    });

    describe("create button", () => {
      it("is disabled when required fields are empty", () => {
        renderWithLocale(<CreateUserModal {...defaultProps} />, locale);
        const buttons = screen.getAllByTestId("mock-button");
        const createButton = buttons.find((btn: HTMLElement) => btn.textContent?.trim() === common.actions.create);
        expect(createButton).toBeDisabled();
      });

      it("is enabled when all required fields are filled", async () => {
        const user = userEvent.setup();
        renderWithLocale(<CreateUserModal {...defaultProps} />, locale);
        const inputs = screen.getAllByTestId("mock-input");
        await user.type(inputs[0], "test@example.com");
        await user.type(inputs[1], "password123");
        await user.type(inputs[2], "John");
        await user.type(inputs[3], "Doe");
        const buttons = screen.getAllByTestId("mock-button");
        const createButton = buttons.find((btn: HTMLElement) => btn.textContent?.trim() === common.actions.create);
        await waitFor(() => expect(createButton).not.toBeDisabled());
      });

      it("calls onCreate with new user data when clicked", async () => {
        const user = userEvent.setup();
        renderWithLocale(<CreateUserModal {...defaultProps} />, locale);
        const inputs = screen.getAllByTestId("mock-input");
        await user.type(inputs[0], "test@example.com");
        await user.type(inputs[1], "password123");
        await user.type(inputs[2], "John");
        await user.type(inputs[3], "Doe");
        const buttons = screen.getAllByTestId("mock-button");
        const createButton = buttons.find((btn: HTMLElement) => btn.textContent?.trim() === common.actions.create)!;
        await waitFor(() => expect(createButton).not.toBeDisabled());
        await user.click(createButton);
        expect(mockOnCreate).toHaveBeenCalledWith(
          expect.objectContaining({
            email: "test@example.com",
            firstName: "John",
            lastName: "Doe",
            department: "React",
            position: "Software Engineer",
            initials: "JD",
            isVerified: false,
            avatar: null,
          })
        );
      });

      it("calls onClose after successful creation", async () => {
        const user = userEvent.setup();
        renderWithLocale(<CreateUserModal {...defaultProps} />, locale);
        const inputs = screen.getAllByTestId("mock-input");
        await user.type(inputs[0], "test@example.com");
        await user.type(inputs[1], "password123");
        await user.type(inputs[2], "John");
        await user.type(inputs[3], "Doe");
        const createButton = await waitFor(() => {
          const buttons = screen.getAllByTestId("mock-button");
          const btn = buttons.find(
            (btn: HTMLElement) => btn.textContent?.trim() === common.actions.create
          );
          expect(btn).not.toBeDisabled();
          return btn as HTMLElement;
        });
        await user.click(createButton);
        await waitFor(() => expect(mockOnClose).toHaveBeenCalledTimes(1));
      });
    });

    describe("cancel button", () => {
      it("calls onClose without creating when cancel is clicked", async () => {
        const user = userEvent.setup();
        renderWithLocale(<CreateUserModal {...defaultProps} />, locale);
        const buttons = screen.getAllByTestId("mock-button");
        const cancelButton = buttons.find((btn: HTMLElement) => btn.textContent?.trim() === common.actions.cancel)!;
        await user.click(cancelButton);
        expect(mockOnCreate).not.toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });
    });
  });
});
