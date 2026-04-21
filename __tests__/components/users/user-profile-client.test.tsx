import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { EmployeeProfile } from "@/lib/users/users-types";
import { UserProfileClient } from "@/app/(protected)/users/[id]/_components/user-profile-client";
import messagesDe from "@/messages/de.json";
import messagesEn from "@/messages/en.json";
import messagesRu from "@/messages/ru.json";

import "@testing-library/jest-dom";

const locales = ["en", "de", "ru"] as const;
type Locale = (typeof locales)[number];

const messagesMap: Record<Locale, any> = {
  en: messagesEn,
  de: messagesDe,
  ru: messagesRu,
};

function renderWithLocale(ui: React.ReactElement, locale: Locale = "en") {
  return render(
    <NextIntlClientProvider locale={locale} messages={messagesMap[locale]}>
      {ui}
    </NextIntlClientProvider>,
  );
}

jest.mock("next/link", () => ({
  __esModule: true,
  default: function MockLink({ href, children, className, ...props }: any) {
    return (
      <a href={href} className={className} data-testid="mock-link" {...props}>
        {children}
      </a>
    );
  },
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => "/users/1",
}));

jest.mock("@/components/ui/avatar", () => ({
  Avatar: ({ children, className }: any) => (
    <div data-testid="mock-avatar" className={className}>
      {children}
    </div>
  ),
  AvatarImage: ({ src, alt }: any) => (
    <img data-testid="mock-avatar-image" src={src} alt={alt} />
  ),
  AvatarFallback: ({ children, className }: any) => (
    <span data-testid="mock-avatar-fallback" className={className}>
      {children}
    </span>
  ),
}));

jest.mock("@/components/ui/input", () => ({
  Input: ({ value, onChange, className, ...props }: any) => (
    <input
      data-testid="mock-input"
      value={value}
      onChange={onChange}
      className={className}
      {...props}
    />
  ),
}));

jest.mock("@/components/ui/label", () => ({
  Label: ({ children, className }: any) => (
    <label data-testid="mock-label" className={className}>
      {children}
    </label>
  ),
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, className, ...props }: any) => (
    <button
      data-testid="mock-button"
      onClick={onClick}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/select", () => {
  const SelectContext = React.createContext<string | undefined>(undefined);

  return {
    Select: ({ value, onValueChange, children, disabled, ...props }: any) => (
      <SelectContext.Provider value={value}>
        <div
          data-testid="mock-select-wrapper"
          data-value={value}
          data-disabled={disabled}
          {...props}
        >
          {children}
        </div>
      </SelectContext.Provider>
    ),
    SelectContent: ({ children, className, ...props }: any) => (
      <div
        data-testid="mock-select-content"
        className={className}
        role="listbox"
        {...props}
      >
        {children}
      </div>
    ),
    SelectItem: ({ children, value, className, ...props }: any) => (
      <div
        data-testid={`mock-select-item-${value}`}
        data-value={value}
        className={className}
        role="option"
        {...props}
      >
        {children}
      </div>
    ),
    SelectTrigger: ({ children, className, ...props }: any) => (
      <button
        data-testid="mock-select-trigger"
        className={className}
        type="button"
        {...props}
      >
        {children}
      </button>
    ),
    SelectValue: ({ placeholder, ...props }: any) => {
      const value = React.useContext(SelectContext);
      return (
        <span data-testid="mock-select-value" {...props}>
          {value || placeholder}
        </span>
      );
    },
  };
});

const mockUpdateProfile = jest.fn();
const mockUpdateUserMeta = jest.fn();
const mockUploadAvatar = jest.fn();

jest.mock("@/app/(protected)/users/[id]/actions", () => ({
  updateProfile: (...args: any[]) => mockUpdateProfile(...args),
  updateUserMeta: (...args: any[]) => mockUpdateUserMeta(...args),
  uploadAvatar: (...args: any[]) => mockUploadAvatar(...args),
}));

jest.mock("lucide-react", () => ({
  Upload: () => <svg data-testid="icon-upload" />,
  ChevronRight: () => <svg data-testid="icon-chevron-right" />,
}));

jest.mock("@/lib/utils", () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(" "),
}));

const mockEmployee: EmployeeProfile = {
  id: 1,
  email: "alice@example.com",
  firstName: "Alice",
  lastName: "Brown",
  department: "React",
  position: "Software Engineer",
  avatar: null,
  initials: "AB",
  isVerified: true,
  memberSince: "2024",
  role: "Employee",
};

const mockDepartments = [
  { id: "1", name: "React" },
  { id: "2", name: ".NET" },
];

const mockPositions = [
  { id: "10", name: "Software Engineer" },
  { id: "11", name: "DevOps Engineer" },
];

const defaultProps = {
  employee: mockEmployee,
  currentUserId: 1,
  currentUserRole: "Admin",
  departments: mockDepartments,
  positions: mockPositions,
};

describe("UserProfileClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe.each(locales)("locale: %s", (locale) => {
    const messages = messagesMap[locale];
    const users = messages.Users;
    const common = messages.Common;

    describe("rendering", () => {
      it("renders breadcrumb navigation", () => {
        renderWithLocale(<UserProfileClient {...defaultProps} />, locale);

        expect(screen.getByText(users.title)).toBeInTheDocument();
        const breadcrumbs = screen.getAllByText("Alice Brown");
        expect(breadcrumbs[0]).toHaveClass("text-red-500");
      });

      it("renders tab navigation", () => {
        renderWithLocale(<UserProfileClient {...defaultProps} />, locale);

        expect(screen.getByText(users.tabs.profile)).toBeInTheDocument();
        expect(screen.getByText(users.tabs.skills)).toBeInTheDocument();
        expect(screen.getByText(users.tabs.languages)).toBeInTheDocument();
      });

      it("renders profile form with employee data", () => {
        renderWithLocale(<UserProfileClient {...defaultProps} />, locale);

        const inputs = screen.getAllByTestId("mock-input");
        expect(inputs[0]).toHaveValue("Alice");
        expect(inputs[1]).toHaveValue("Brown");
      });

      it("renders avatar with initials fallback", () => {
        renderWithLocale(<UserProfileClient {...defaultProps} />, locale);

        expect(screen.getByTestId("mock-avatar-fallback")).toHaveTextContent(
          "AB",
        );
      });

      it("shows member since info when available", () => {
        renderWithLocale(<UserProfileClient {...defaultProps} />, locale);

        expect(screen.getByText(/A member since 2024/)).toBeInTheDocument();
      });

      it("displays field labels in correct locale", () => {
        renderWithLocale(<UserProfileClient {...defaultProps} />, locale);

        const labels = screen.getAllByTestId("mock-label");
        expect(labels[0]).toHaveTextContent(common.fields.firstName);
        expect(labels[1]).toHaveTextContent(common.fields.lastName);
      });
    });

    describe("tab switching", () => {
      it("shows profile content by default", () => {
        renderWithLocale(<UserProfileClient {...defaultProps} />, locale);

        expect(screen.getAllByTestId("mock-input")[0]).toBeInTheDocument();
        expect(screen.queryByText("TODO")).not.toBeInTheDocument();
      });

      it("shows skills tab content when clicked", async () => {
        const user = userEvent.setup();
        renderWithLocale(<UserProfileClient {...defaultProps} />, locale);

        await user.click(screen.getByText(users.tabs.skills));

        expect(screen.getByText("TODO")).toBeInTheDocument();
      });

      it("shows languages tab content when clicked", async () => {
        const user = userEvent.setup();
        renderWithLocale(<UserProfileClient {...defaultProps} />, locale);

        await user.click(screen.getByText(users.tabs.languages));

        expect(screen.getByText("TODO")).toBeInTheDocument();
      });

      it("highlights active tab", () => {
        renderWithLocale(<UserProfileClient {...defaultProps} />, locale);

        const profileTab = screen.getByText(users.tabs.profile);
        expect(profileTab.className).toContain("text-red-500");
      });
    });

    describe("form editing", () => {
      it("enables editing for current user", () => {
        renderWithLocale(
          <UserProfileClient {...defaultProps} currentUserId={1} />,
          locale,
        );

        const inputs = screen.getAllByTestId("mock-input");
        expect(inputs[0]).not.toBeDisabled();
      });

      it("enables editing for Admin role", () => {
        renderWithLocale(
          <UserProfileClient
            {...defaultProps}
            currentUserId={999}
            currentUserRole="Admin"
          />,
          locale,
        );

        const inputs = screen.getAllByTestId("mock-input");
        expect(inputs[0]).not.toBeDisabled();
      });

      it("disables editing for other users", () => {
        renderWithLocale(
          <UserProfileClient
            {...defaultProps}
            currentUserId={999}
            currentUserRole="Employee"
          />,
          locale,
        );

        const inputs = screen.getAllByTestId("mock-input");
        expect(inputs[0]).toBeDisabled();
      });

      it("updates form state when typing", async () => {
        const user = userEvent.setup();
        renderWithLocale(<UserProfileClient {...defaultProps} />, locale);

        const inputs = screen.getAllByTestId("mock-input");
        await user.clear(inputs[0]);
        await user.type(inputs[0], "Alicia");

        expect(inputs[0]).toHaveValue("Alicia");
      });
    });

    describe("department and position selects", () => {
      it("displays current department as selected", () => {
        renderWithLocale(<UserProfileClient {...defaultProps} />, locale);

        const wrappers = screen.getAllByTestId("mock-select-wrapper");
        expect(wrappers[0]).toHaveAttribute("data-value", "1");
      });

      it("displays current position as selected", () => {
        renderWithLocale(<UserProfileClient {...defaultProps} />, locale);

        const wrappers = screen.getAllByTestId("mock-select-wrapper");
        expect(wrappers[1]).toHaveAttribute("data-value", "10");
      });

      it("renders department options", () => {
        renderWithLocale(<UserProfileClient {...defaultProps} />, locale);

        const contents = screen.getAllByTestId("mock-select-content");
        const items = Array.from(
          contents[0].querySelectorAll('[data-testid^="mock-select-item-"]'),
        );

        expect(items[0]?.textContent).toBe("React");
        expect(items[1]?.textContent).toBe(".NET");
      });

      it("displays select labels in correct locale", () => {
        renderWithLocale(<UserProfileClient {...defaultProps} />, locale);

        const labels = screen.getAllByTestId("mock-label");
        expect(labels[2]).toHaveTextContent(common.fields.department);
        expect(labels[3]).toHaveTextContent(common.fields.position);
      });
    });

    describe("avatar upload", () => {
      it("shows upload option for editable profiles", () => {
        renderWithLocale(<UserProfileClient {...defaultProps} />, locale);

        expect(screen.getByText(users.uploadAvatar)).toBeInTheDocument();
      });

      it("hides upload option for non-editable profiles", () => {
        renderWithLocale(
          <UserProfileClient
            {...defaultProps}
            currentUserId={999}
            currentUserRole="Employee"
          />,
          locale,
        );

        expect(screen.queryByText(users.uploadAvatar)).not.toBeInTheDocument();
      });

      it("displays upload hint in correct locale", () => {
        renderWithLocale(<UserProfileClient {...defaultProps} />, locale);

        expect(screen.getByText(users.uploadHint)).toBeInTheDocument();
      });
    });

    describe("save functionality", () => {
      it("shows update button for editable profiles", () => {
        renderWithLocale(<UserProfileClient {...defaultProps} />, locale);

        const buttons = screen.getAllByTestId("mock-button");
        const updateBtn = buttons.find(
          (btn: HTMLElement) =>
            btn.textContent?.trim() === common.actions.update,
        );

        expect(updateBtn).toBeInTheDocument();
      });

      it("disables update button when form is not dirty", () => {
        renderWithLocale(<UserProfileClient {...defaultProps} />, locale);

        const buttons = screen.getAllByTestId("mock-button");
        const updateBtn = buttons.find(
          (btn: HTMLElement) =>
            btn.textContent?.trim() === common.actions.update,
        );

        expect(updateBtn).toBeDisabled();
      });

      it("enables update button when form is dirty", async () => {
        const user = userEvent.setup();
        renderWithLocale(<UserProfileClient {...defaultProps} />, locale);

        const inputs = screen.getAllByTestId("mock-input");
        await user.clear(inputs[0]);
        await user.type(inputs[0], "Alicia");

        const buttons = screen.getAllByTestId("mock-button");
        const updateBtn = buttons.find(
          (btn: HTMLElement) =>
            btn.textContent?.trim() === common.actions.update,
        );

        expect(updateBtn).not.toBeDisabled();
      });

      it("calls updateProfile on save", async () => {
        const user = userEvent.setup();
        mockUpdateProfile.mockResolvedValue({
          first_name: "Alicia",
          last_name: "Brown",
        });

        renderWithLocale(<UserProfileClient {...defaultProps} />, locale);

        const inputs = screen.getAllByTestId("mock-input");
        await user.clear(inputs[0]);
        await user.type(inputs[0], "Alicia");

        const buttons = screen.getAllByTestId("mock-button");
        const updateBtn = buttons.find(
          (btn: HTMLElement) =>
            btn.textContent?.trim() === common.actions.update,
        );

        await user.click(updateBtn!);

        await waitFor(() => {
          expect(mockUpdateProfile).toHaveBeenCalledWith(1, "Alicia", "Brown");
        });
      });

      it("displays error message on save failure", async () => {
        const user = userEvent.setup();
        mockUpdateProfile.mockRejectedValue(new Error("Save failed"));

        renderWithLocale(<UserProfileClient {...defaultProps} />, locale);

        const inputs = screen.getAllByTestId("mock-input");
        await user.clear(inputs[0]);
        await user.type(inputs[0], "Alicia");

        const buttons = screen.getAllByTestId("mock-button");
        const updateBtn = buttons.find(
          (btn: HTMLElement) =>
            btn.textContent?.trim() === common.actions.update,
        );

        await user.click(updateBtn!);

        await waitFor(() => {
          expect(screen.getByText("Save failed")).toBeInTheDocument();
        });
      });

      it("displays saving state in correct locale", async () => {
        const user = userEvent.setup();
        mockUpdateProfile.mockImplementation(
          () => new Promise((resolve) => setTimeout(resolve, 100)),
        );

        renderWithLocale(<UserProfileClient {...defaultProps} />, locale);

        const inputs = screen.getAllByTestId("mock-input");
        await user.clear(inputs[0]);
        await user.type(inputs[0], "Alicia");

        const buttons = screen.getAllByTestId("mock-button");
        const updateBtn = buttons.find(
          (btn: HTMLElement) =>
            btn.textContent?.trim() === common.actions.update,
        );

        await user.click(updateBtn!);

        expect(screen.getByText(common.actions.saving)).toBeInTheDocument();
      });
    });

    describe("edge cases", () => {
      it("handles employee with empty names", () => {
        renderWithLocale(
          <UserProfileClient
            {...defaultProps}
            employee={{ ...mockEmployee, firstName: "", lastName: "" }}
          />,
          locale,
        );

        expect(screen.getByText(users.unnamedUser)).toBeInTheDocument();
      });

      it("handles missing department/position mapping", () => {
        renderWithLocale(
          <UserProfileClient
            {...defaultProps}
            employee={{
              ...mockEmployee,
              department: "Unknown",
              position: "Unknown",
            }}
          />,
          locale,
        );

        const wrappers = screen.getAllByTestId("mock-select-wrapper");
        expect(wrappers[0]).toHaveAttribute("data-value", "");
      });
    });
  });
});
