import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import React from "react";
import { NextIntlClientProvider } from "next-intl";
import type { EmployeeProfile } from "@/lib/users/users-types";
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

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => "/users/1",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({ id: "1" }),
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

jest.mock("@/components/ui/avatar", () => ({
  Avatar: ({ children, className }: any) => (
    <div data-testid="mock-avatar" className={className}>{children}</div>
  ),
  AvatarImage: ({ src, alt }: any) => <img data-testid="mock-avatar-image" src={src} alt={alt} />,
  AvatarFallback: ({ children, className }: any) => (
    <span data-testid="mock-avatar-fallback" className={className}>{children}</span>
  ),
}));

jest.mock("@/components/ui/select", () => ({
  Select: ({ children, value, onValueChange, disabled }: any) => (
    <select data-testid="mock-select" value={value} onChange={(e) => onValueChange?.(e.target.value)} disabled={disabled}>
      {children}
    </select>
  ),
  SelectTrigger: ({ children, className }: any) => (
    <div data-testid="mock-select-trigger" className={className}>{children}</div>
  ),
  SelectValue: ({ placeholder }: any) => <option>{placeholder}</option>,
  SelectContent: ({ children, className }: any) => (
    <div data-testid="mock-select-content" className={className}>{children}</div>
  ),
  SelectItem: ({ children, value, className }: any) => (
    <option data-testid="mock-select-item" value={value} className={className}>{children}</option>
  ),
}));

jest.mock("@/components/ui/label", () => ({
  Label: ({ children, className, ...props }: any) => (
    <label data-testid="mock-label" className={className} {...props}>{children}</label>
  ),
}));

jest.mock("@/app/(protected)/users/[id]/actions", () => ({
  updateProfile: jest.fn().mockResolvedValue(undefined),
  updateUserMeta: jest.fn().mockResolvedValue(undefined),
  uploadAvatar: jest.fn().mockResolvedValue(undefined),
  deleteAvatar: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/app/(protected)/users/[id]/_components/profile-tabs", () => ({
  ProfileTabs: ({ tabs }: any) => (
    <div data-testid="mock-profile-tabs">
      {tabs.map((t: any) => <span key={t.id}>{t.label}</span>)}
    </div>
  ),
}));

jest.mock("lucide-react", () => ({
  Upload: () => <svg data-testid="icon-upload" />,
  ChevronRight: () => <svg data-testid="icon-chevron" />,
  X: () => <svg data-testid="icon-close" />,
}));

const mockEmployee: EmployeeProfile = {
  id: 1,
  email: "test@example.com",
  firstName: "John",
  lastName: "Doe",
  department: "Engineering",
  position: "Senior Developer",
  avatar: null,
  initials: "JD",
  isVerified: true,
  memberSince: "Jan 1, 2023",
  role: "employee",
  cvs: [],
};

const mockDepartments = [
  { id: "1", name: "Engineering" },
  { id: "2", name: "Design" },
];

const mockPositions = [
  { id: "1", name: "Senior Developer" },
  { id: "2", name: "Junior Developer" },
];

const defaultProps = {
  employee: mockEmployee,
  currentUserId: 1,
  currentUserRole: "Admin",
  departments: mockDepartments,
  positions: mockPositions,
  userId: "1",
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
      it("renders user name and email", () => {
        const { UserProfileClient } = require("@/app/(protected)/users/[id]/_components/user-profile-client");
        renderWithLocale(<UserProfileClient {...defaultProps} />, locale);

        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("test@example.com")).toBeInTheDocument();
      });

      it("renders member since date when available", () => {
        const { UserProfileClient } = require("@/app/(protected)/users/[id]/_components/user-profile-client");
        renderWithLocale(<UserProfileClient {...defaultProps} />, locale);

        expect(screen.getByText(users.memberSince.replace("{date}", "Jan 1, 2023"))).toBeInTheDocument();
      });

      it("renders avatar with initials when no image", () => {
        const { UserProfileClient } = require("@/app/(protected)/users/[id]/_components/user-profile-client");
        renderWithLocale(<UserProfileClient {...defaultProps} />, locale);

        expect(screen.getByText("JD")).toBeInTheDocument();
      });

      it("renders profile tabs with correct labels", () => {
        const { UserProfileClient } = require("@/app/(protected)/users/[id]/_components/user-profile-client");
        renderWithLocale(<UserProfileClient {...defaultProps} />, locale);

        expect(screen.getByText(users.tabs.profile)).toBeInTheDocument();
        expect(screen.getByText(users.tabs.skills)).toBeInTheDocument();
        expect(screen.getByText(users.tabs.languages)).toBeInTheDocument();
      });

      it("renders form fields with correct labels", () => {
        const { UserProfileClient } = require("@/app/(protected)/users/[id]/_components/user-profile-client");
        renderWithLocale(<UserProfileClient {...defaultProps} />, locale);

        expect(screen.getByText(common.fields.firstName)).toBeInTheDocument();
        expect(screen.getByText(common.fields.lastName)).toBeInTheDocument();
        expect(screen.getByText(common.fields.department)).toBeInTheDocument();
        expect(screen.getByText(common.fields.position)).toBeInTheDocument();
      });
    });

    describe("edit permissions", () => {
      it("enables form fields when user can edit (same user)", () => {
        const { UserProfileClient } = require("@/app/(protected)/users/[id]/_components/user-profile-client");
        renderWithLocale(<UserProfileClient {...defaultProps} />, locale);

        const inputs = screen.getAllByTestId("mock-input");
        expect(inputs[0]).not.toBeDisabled();
        expect(inputs[1]).not.toBeDisabled();
      });

      it("enables form fields when user is admin", () => {
        const { UserProfileClient } = require("@/app/(protected)/users/[id]/_components/user-profile-client");
        renderWithLocale(<UserProfileClient {...defaultProps} currentUserRole="Admin" />, locale);

        const inputs = screen.getAllByTestId("mock-input");
        expect(inputs[0]).not.toBeDisabled();
      });

      it("disables form fields when user cannot edit", () => {
        const { UserProfileClient } = require("@/app/(protected)/users/[id]/_components/user-profile-client");
        renderWithLocale(<UserProfileClient {...defaultProps} currentUserId={999} currentUserRole="Employee" />, locale);

        const inputs = screen.getAllByTestId("mock-input");
        expect(inputs[0]).toBeDisabled();
      });

      it("hides avatar upload controls when cannot edit", () => {
        const { UserProfileClient } = require("@/app/(protected)/users/[id]/_components/user-profile-client");
        renderWithLocale(<UserProfileClient {...defaultProps} currentUserId={999} currentUserRole="Employee" />, locale);

        expect(screen.queryByTestId("icon-upload")).not.toBeInTheDocument();
      });
    });

    describe("form interactions", () => {
      it("updates form state when typing in first name", async () => {
        const user = userEvent.setup();
        const { UserProfileClient } = require("@/app/(protected)/users/[id]/_components/user-profile-client");
        renderWithLocale(<UserProfileClient {...defaultProps} />, locale);

        const inputs = screen.getAllByTestId("mock-input");
        await user.type(inputs[0], "Jane");

        expect(inputs[0]).toHaveValue("JohnJane");
      });

      it("updates department when selecting from dropdown", async () => {
        const user = userEvent.setup();
        const { UserProfileClient } = require("@/app/(protected)/users/[id]/_components/user-profile-client");
        renderWithLocale(<UserProfileClient {...defaultProps} />, locale);

        const select = screen.getAllByTestId("mock-select")[0];
        await user.selectOptions(select, "2");

        expect(select).toHaveValue("2");
      });
    });

    describe("save functionality", () => {
      it("calls updateProfile when save is clicked with changes", async () => {
        const user = userEvent.setup();
        const { UserProfileClient } = require("@/app/(protected)/users/[id]/_components/user-profile-client");
        const { updateProfile } = require("@/app/(protected)/users/[id]/actions");

        renderWithLocale(<UserProfileClient {...defaultProps} />, locale);

        const inputs = screen.getAllByTestId("mock-input");
        await user.clear(inputs[0]);
        await user.type(inputs[0], "Jane");

        const saveBtn = screen.getByRole("button", { name: common.actions.update });
        await user.click(saveBtn);

        await waitFor(() => {
          expect(updateProfile).toHaveBeenCalledWith(1, "Jane", "Doe");
        });
      });

      it("disables save button when no changes", () => {
        const { UserProfileClient } = require("@/app/(protected)/users/[id]/_components/user-profile-client");
        renderWithLocale(<UserProfileClient {...defaultProps} />, locale);

        const saveBtn = screen.getByRole("button", { name: common.actions.update });
        expect(saveBtn).toBeDisabled();
      });

      it("shows saving state when updating", async () => {
        const user = userEvent.setup();
        const { UserProfileClient } = require("@/app/(protected)/users/[id]/_components/user-profile-client");
        const { updateProfile } = require("@/app/(protected)/users/[id]/actions");
        updateProfile.mockImplementation(() => new Promise((res) => setTimeout(res, 100)));

        renderWithLocale(<UserProfileClient {...defaultProps} />, locale);

        const inputs = screen.getAllByTestId("mock-input");
        await user.clear(inputs[0]);
        await user.type(inputs[0], "Jane");

        const saveBtn = screen.getByRole("button", { name: common.actions.update });
        await user.click(saveBtn);

        expect(screen.getByText(common.actions.saving)).toBeInTheDocument();
      });
    });

    describe("avatar handling", () => {
      it("shows delete button on avatar hover when can edit", () => {
        const { UserProfileClient } = require("@/app/(protected)/users/[id]/_components/user-profile-client");
        renderWithLocale(<UserProfileClient {...defaultProps} employee={{ ...mockEmployee, avatar: "/avatar.jpg" }} />, locale);

        expect(screen.getByTestId("icon-close")).toBeInTheDocument();
      });

      it("calls deleteAvatar when delete button is clicked", async () => {
        const user = userEvent.setup();
        const { UserProfileClient } = require("@/app/(protected)/users/[id]/_components/user-profile-client");
        const { deleteAvatar } = require("@/app/(protected)/users/[id]/actions");
        global.confirm = jest.fn(() => true);

        renderWithLocale(<UserProfileClient {...defaultProps} employee={{ ...mockEmployee, avatar: "/avatar.jpg" }} />, locale);

        await user.click(screen.getByTestId("icon-close"));

        await waitFor(() => {
          expect(deleteAvatar).toHaveBeenCalledWith(1);
        });
      });

      it("shows file size error when uploading large file", async () => {
        const user = userEvent.setup();
        const { UserProfileClient } = require("@/app/(protected)/users/[id]/_components/user-profile-client");
        renderWithLocale(<UserProfileClient {...defaultProps} />, locale);

        const file = new File(["x".repeat(1024 * 1024 + 1)], "large.jpg", { type: "image/jpeg" });
        const fileInput = screen.getByRole("button", { name: users.uploadAvatar }).closest("div")?.querySelector("input");

        if (fileInput) {
          await user.upload(fileInput, file);
          expect(screen.getByText(users.fileSizeError)).toBeInTheDocument();
        }
      });
    });

    describe("error handling", () => {
      it("displays error message when update fails", async () => {
        const user = userEvent.setup();
        const { UserProfileClient } = require("@/app/(protected)/users/[id]/_components/user-profile-client");
        const { updateProfile } = require("@/app/(protected)/users/[id]/actions");
        updateProfile.mockRejectedValueOnce(new Error("Failed"));

        renderWithLocale(<UserProfileClient {...defaultProps} />, locale);

        const inputs = screen.getAllByTestId("mock-input");
        await user.clear(inputs[0]);
        await user.type(inputs[0], "Jane");

        const saveBtn = screen.getByRole("button", { name: common.actions.update });
        await user.click(saveBtn);

        await waitFor(() => {
          expect(screen.getByText("Failed")).toBeInTheDocument();
        });
      });
    });
  });
});
