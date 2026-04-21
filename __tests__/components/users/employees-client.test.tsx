import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { EmployeeCard } from "@/lib/users/users-types";
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

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => "/users",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

jest.mock("@/components/ui/input", () => ({
  Input: ({ value, onChange, placeholder, className, ...props }: any) => (
    <input
      data-testid="mock-input"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      {...props}
    />
  ),
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    disabled,
    className,
    "data-testid": testId,
    ...props
  }: any) => (
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

jest.mock("@/components/ui/table", () => ({
  Table: ({ children }: any) => (
    <table data-testid="mock-table">{children}</table>
  ),
  TableHeader: ({ children }: any) => (
    <thead data-testid="mock-table-header">{children}</thead>
  ),
  TableBody: ({ children }: any) => (
    <tbody data-testid="mock-table-body">{children}</tbody>
  ),
  TableRow: ({ children, onClick, className }: any) => (
    <tr data-testid="mock-table-row" onClick={onClick} className={className}>
      {children}
    </tr>
  ),
  TableHead: ({ children, className, onClick }: any) => (
    <th data-testid="mock-table-head" className={className} onClick={onClick}>
      {children}
    </th>
  ),
  TableCell: ({ children, className }: any) => (
    <td data-testid="mock-table-cell" className={className}>
      {children}
    </td>
  ),
}));

jest.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: any) => (
    <div data-testid="mock-dropdown">{children}</div>
  ),
  DropdownMenuTrigger: ({ children }: any) => (
    <span data-testid="mock-dropdown-trigger">{children}</span>
  ),
  DropdownMenuContent: ({ children, align, className }: any) => (
    <div
      data-testid="mock-dropdown-content"
      data-align={align}
      className={className}
    >
      {children}
    </div>
  ),
  DropdownMenuItem: ({ children, onClick, className }: any) => (
    <div
      data-testid="mock-dropdown-item"
      onClick={onClick}
      className={className}
    >
      {children}
    </div>
  ),
}));

jest.mock("@/components/ui/badge", () => ({
  Badge: ({ children, variant, className }: any) => (
    <span data-testid="mock-badge" data-variant={variant} className={className}>
      {children}
    </span>
  ),
}));

jest.mock("@/app/(protected)/users/_components/update-user-modal", () => ({
  UpdateUserModal: ({ open, onClose }: any) =>
    open ? (
      <div data-testid="mock-update-modal" onClick={onClose}>
        Update Modal
      </div>
    ) : null,
}));

jest.mock("@/app/(protected)/users/_components/create-user-modal", () => ({
  CreateUserModal: ({ open, onClose }: any) =>
    open ? (
      <div data-testid="mock-create-modal" onClick={onClose}>
        Create Modal
      </div>
    ) : null,
}));

jest.mock("lucide-react", () => ({
  Search: () => <svg data-testid="icon-search" />,
  MoreVertical: () => <svg data-testid="icon-more" />,
  ChevronRight: () => <svg data-testid="icon-chevron-right" />,
  ChevronUp: () => <svg data-testid="icon-chevron-up" />,
  Users: () => <svg data-testid="icon-users" />,
  Plus: () => <svg data-testid="icon-plus" />,
}));

const mockEmployees: EmployeeCard[] = [
  {
    id: 1,
    email: "alice@example.com",
    firstName: "Alice",
    lastName: "Brown",
    department: "React",
    position: "Software Engineer",
    avatar: null,
    initials: "AB",
    isVerified: true,
  },
  {
    id: 2,
    email: "bob@example.com",
    firstName: "Bob",
    lastName: "Smith",
    department: ".NET",
    position: "DevOps Engineer",
    avatar: null,
    initials: "BS",
    isVerified: false,
  },
];

const defaultProps = {
  employees: mockEmployees,
  currentUserId: 1,
  currentUserRole: "Admin",
  departments: [],
  positions: [],
};

describe("EmployeesClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
  });

  describe.each(locales)("locale: %s", (locale) => {
    const messages = messagesMap[locale];
    const users = messages.Users;
    const common = messages.Common;

    describe("rendering", () => {
      it("renders employee table with all rows", () => {
        const {
          EmployeesClient,
        } = require("@/app/(protected)/users/_components/employees-client");
        renderWithLocale(<EmployeesClient {...defaultProps} />, locale);

        expect(screen.getByText("Alice")).toBeInTheDocument();
        expect(screen.getByText("Bob")).toBeInTheDocument();
        expect(screen.getByText("alice@example.com")).toBeInTheDocument();
      });

      it("renders department badges", () => {
        const {
          EmployeesClient,
        } = require("@/app/(protected)/users/_components/employees-client");
        renderWithLocale(<EmployeesClient {...defaultProps} />, locale);

        expect(screen.getByText("React")).toBeInTheDocument();
        expect(screen.getByText(".NET")).toBeInTheDocument();
      });

      it("renders avatars with initials", () => {
        const {
          EmployeesClient,
        } = require("@/app/(protected)/users/_components/employees-client");
        renderWithLocale(<EmployeesClient {...defaultProps} />, locale);

        expect(screen.getAllByText("AB")).toHaveLength(1);
        expect(screen.getAllByText("BS")).toHaveLength(1);
      });

      it("displays title in correct locale", () => {
        const {
          EmployeesClient,
        } = require("@/app/(protected)/users/_components/employees-client");
        renderWithLocale(<EmployeesClient {...defaultProps} />, locale);

        expect(screen.getByText(users.title)).toBeInTheDocument();
      });

      it("displays search placeholder in correct locale", () => {
        const {
          EmployeesClient,
        } = require("@/app/(protected)/users/_components/employees-client");
        renderWithLocale(<EmployeesClient {...defaultProps} />, locale);

        const searchInput = screen.getByTestId("mock-input");
        expect(searchInput).toHaveAttribute(
          "placeholder",
          common.placeholders.search,
        );
      });
    });

    describe("search functionality", () => {
      it("filters employees by name", async () => {
        const user = userEvent.setup();
        const {
          EmployeesClient,
        } = require("@/app/(protected)/users/_components/employees-client");
        renderWithLocale(<EmployeesClient {...defaultProps} />, locale);

        const searchInput = screen.getByTestId("mock-input");
        await user.type(searchInput, "Alice");

        expect(screen.getByText("Alice")).toBeInTheDocument();
        expect(screen.queryByText("Bob")).not.toBeInTheDocument();
      });

      it("filters employees by email", async () => {
        const user = userEvent.setup();
        const {
          EmployeesClient,
        } = require("@/app/(protected)/users/_components/employees-client");
        renderWithLocale(<EmployeesClient {...defaultProps} />, locale);

        const searchInput = screen.getByTestId("mock-input");
        await user.type(searchInput, "bob@example");

        expect(screen.getByText("Bob")).toBeInTheDocument();
        expect(screen.queryByText("Alice")).not.toBeInTheDocument();
      });

      it("filters employees by department", async () => {
        const user = userEvent.setup();
        const {
          EmployeesClient,
        } = require("@/app/(protected)/users/_components/employees-client");
        renderWithLocale(<EmployeesClient {...defaultProps} />, locale);

        const searchInput = screen.getByTestId("mock-input");
        await user.type(searchInput, "React");

        expect(screen.getByText("React")).toBeInTheDocument();
        expect(screen.queryByText(".NET")).not.toBeInTheDocument();
      });

      it("shows empty state when no results", async () => {
        const user = userEvent.setup();
        const {
          EmployeesClient,
        } = require("@/app/(protected)/users/_components/employees-client");
        renderWithLocale(<EmployeesClient {...defaultProps} />, locale);

        const searchInput = screen.getByTestId("mock-input");
        await user.type(searchInput, "nonexistent");

        expect(screen.getByText(users.noResults)).toBeInTheDocument();
      });
    });

    describe("sorting", () => {
      it("sorts by department ascending by default", () => {
        const {
          EmployeesClient,
        } = require("@/app/(protected)/users/_components/employees-client");
        renderWithLocale(<EmployeesClient {...defaultProps} />, locale);

        const rows = screen.getAllByTestId("mock-table-row");
        const bodyRows = rows.slice(1);

        const firstRowCells = bodyRows[0].querySelectorAll(
          '[data-testid="mock-table-cell"]',
        );
        const secondRowCells = bodyRows[1].querySelectorAll(
          '[data-testid="mock-table-cell"]',
        );

        expect(firstRowCells[4]).toHaveTextContent("React");
        expect(secondRowCells[4]).toHaveTextContent(".NET");
      });

      it("toggles sort order when department header is clicked", async () => {
        const user = userEvent.setup();
        const {
          EmployeesClient,
        } = require("@/app/(protected)/users/_components/employees-client");
        renderWithLocale(<EmployeesClient {...defaultProps} />, locale);

        const departmentHeader = screen.getAllByTestId("mock-table-head")[4];
        await user.click(departmentHeader);

        const rows = screen.getAllByTestId("mock-table-row");
        const bodyRows = rows.slice(1);

        const firstRowCells = bodyRows[0].querySelectorAll(
          '[data-testid="mock-table-cell"]',
        );
        const secondRowCells = bodyRows[1].querySelectorAll(
          '[data-testid="mock-table-cell"]',
        );

        expect(firstRowCells[4]).toHaveTextContent(".NET");
        expect(secondRowCells[4]).toHaveTextContent("React");
      });

      it("displays department header in correct locale", () => {
        const {
          EmployeesClient,
        } = require("@/app/(protected)/users/_components/employees-client");
        renderWithLocale(<EmployeesClient {...defaultProps} />, locale);

        const headers = screen.getAllByTestId("mock-table-head");
        expect(headers[4]).toHaveTextContent(common.fields.department);
      });
    });

    describe("actions dropdown", () => {
      it("shows dropdown for current user", () => {
        const {
          EmployeesClient,
        } = require("@/app/(protected)/users/_components/employees-client");
        renderWithLocale(<EmployeesClient {...defaultProps} />, locale);

        const triggers = screen.getAllByTestId("mock-dropdown-trigger");
        expect(triggers).toHaveLength(2);
      });

      it("navigates to profile on View profile click", async () => {
        const user = userEvent.setup();
        const {
          EmployeesClient,
        } = require("@/app/(protected)/users/_components/employees-client");
        renderWithLocale(<EmployeesClient {...defaultProps} />, locale);

        const bobRow = screen.getByText("bob@example.com").closest("tr");
        const trigger = bobRow!.querySelector(
          '[data-testid="mock-dropdown-trigger"]',
        );

        await user.click(trigger!);

        const items = screen.getAllByTestId("mock-dropdown-item");
        await user.click(items[0]);

        expect(mockPush).toHaveBeenCalledWith("/users/2");
      });

      it("opens update modal on Update user click", async () => {
        const user = userEvent.setup();
        const {
          EmployeesClient,
        } = require("@/app/(protected)/users/_components/employees-client");
        renderWithLocale(<EmployeesClient {...defaultProps} />, locale);

        const bobRow = screen.getByText("bob@example.com").closest("tr");
        const trigger = bobRow!.querySelector(
          '[data-testid="mock-dropdown-trigger"]',
        );
        await user.click(trigger!);

        const items = screen.getAllByTestId("mock-dropdown-item");
        await user.click(items[1]);

        expect(screen.getByTestId("mock-update-modal")).toBeInTheDocument();
      });

      it("displays dropdown items in correct locale", async () => {
        const user = userEvent.setup();
        const {
          EmployeesClient,
        } = require("@/app/(protected)/users/_components/employees-client");
        renderWithLocale(<EmployeesClient {...defaultProps} />, locale);

        const bobRow = screen.getByText("bob@example.com").closest("tr");
        const trigger = bobRow!.querySelector(
          '[data-testid="mock-dropdown-trigger"]',
        );
        await user.click(trigger!);

        const items = screen.getAllByTestId("mock-dropdown-item");
        expect(items[0]).toHaveTextContent(users.viewProfile);
        expect(items[1]).toHaveTextContent(users.updateAction);
      });
    });

    describe("create user button", () => {
      it("shows create button for Admin role", () => {
        const {
          EmployeesClient,
        } = require("@/app/(protected)/users/_components/employees-client");
        renderWithLocale(<EmployeesClient {...defaultProps} />, locale);

        expect(screen.getByTestId("create-user-button")).toBeInTheDocument();
      });

      it("hides create button for non-Admin role", () => {
        const {
          EmployeesClient,
        } = require("@/app/(protected)/users/_components/employees-client");
        renderWithLocale(
          <EmployeesClient {...defaultProps} currentUserRole="Employee" />,
          locale,
        );

        expect(
          screen.queryByTestId("create-user-button"),
        ).not.toBeInTheDocument();
      });

      it("opens create modal when clicked", async () => {
        const user = userEvent.setup();
        const {
          EmployeesClient,
        } = require("@/app/(protected)/users/_components/employees-client");
        renderWithLocale(<EmployeesClient {...defaultProps} />, locale);

        const createBtn = screen.getByTestId("create-user-button");
        await user.click(createBtn);
        expect(screen.getByTestId("mock-create-modal")).toBeInTheDocument();
      });

      it("displays create button text in correct locale", () => {
        const {
          EmployeesClient,
        } = require("@/app/(protected)/users/_components/employees-client");
        renderWithLocale(<EmployeesClient {...defaultProps} />, locale);

        const createBtn = screen.getByTestId("create-user-button");
        expect(createBtn).toHaveTextContent(users.createUserButton);
      });
    });

    describe("row navigation", () => {
      it("navigates to user profile on row click", async () => {
        const user = userEvent.setup();
        const {
          EmployeesClient,
        } = require("@/app/(protected)/users/_components/employees-client");
        renderWithLocale(<EmployeesClient {...defaultProps} />, locale);

        const bobRow = screen.getByText("bob@example.com").closest("tr");
        await user.click(bobRow!);

        expect(mockPush).toHaveBeenCalledWith("/users/2");
      });
    });

    describe("table headers", () => {
      it("displays all headers in correct locale", () => {
        const {
          EmployeesClient,
        } = require("@/app/(protected)/users/_components/employees-client");
        renderWithLocale(<EmployeesClient {...defaultProps} />, locale);

        const headers = screen.getAllByTestId("mock-table-head");
        expect(headers[1]).toHaveTextContent(common.fields.firstName);
        expect(headers[2]).toHaveTextContent(common.fields.lastName);
        expect(headers[3]).toHaveTextContent(common.fields.email);
        expect(headers[4]).toHaveTextContent(common.fields.department);
        expect(headers[5]).toHaveTextContent(common.fields.position);
      });
    });
  });
});
