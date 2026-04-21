import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { UsersLayoutClient } from "@/app/(protected)/users/_components/users-layout-client";
import { UserRole } from "@/gqlcodegen/graphql";
import messagesDe from "@/messages/de.json";
import messagesEn from "@/messages/en.json";
import messagesRu from "@/messages/ru.json";
import { useUserStore } from "@/store/use-user-store";

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
  usePathname: () => "/users",
}));

jest.mock("@/components/ui/avatar", () => ({
  Avatar: ({ children, className }: any) => (
    <div data-testid="mock-avatar" className={className}>
      {children}
    </div>
  ),
  AvatarImage: ({ src }: any) => (
    <img data-testid="mock-avatar-image" src={src} />
  ),
  AvatarFallback: ({ children, className }: any) => (
    <span data-testid="mock-avatar-fallback" className={className}>
      {children}
    </span>
  ),
}));

jest.mock("@/lib/utils", () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(" "),
}));

jest.mock("lucide-react", () => ({
  Users: () => <svg data-testid="icon-users" />,
  Lightbulb: () => <svg data-testid="icon-lightbulb" />,
  Languages: () => <svg data-testid="icon-languages" />,
  FileText: () => <svg data-testid="icon-filetext" />,
  ChevronLeft: ({ className, ...props }: any) => (
    <svg data-testid="icon-chevron-left" className={className} {...props} />
  ),
}));

const mockInitialUser = {
  id: "1",
  role: UserRole.Employee,
  profile: {
    first_name: "Alice",
    last_name: "Brown",
    avatar: null,
  },
};

const defaultProps = {
  initialUser: mockInitialUser,
  children: <div data-testid="mock-children">Page Content</div>,
};

describe("UsersLayoutClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useUserStore.setState({ user: mockInitialUser });
  });

  describe.each(locales)("locale: %s", (locale) => {
    const messages = messagesMap[locale];
    const users = messages.Users;

    describe("sidebar rendering", () => {
      it("renders navigation items", () => {
        renderWithLocale(<UsersLayoutClient {...defaultProps} />, locale);

        const links = screen.getAllByTestId("mock-link");
        const linkHrefs = links.map((link: HTMLElement) =>
          link.getAttribute("href"),
        );

        expect(linkHrefs).toContain("/users");
        expect(linkHrefs).toContain("/skills");
        expect(linkHrefs).toContain("/languages");
        expect(linkHrefs).toContain("/cvs");
      });

      it("renders profile section with user initials", () => {
        renderWithLocale(<UsersLayoutClient {...defaultProps} />, locale);

        const fallback = screen.getByTestId("mock-avatar-fallback");
        expect(fallback).toHaveTextContent("AB");
      });

      it("renders user display name", () => {
        renderWithLocale(<UsersLayoutClient {...defaultProps} />, locale);
        expect(screen.getByText("Alice Brown")).toBeInTheDocument();
      });

      it("renders collapse/expand toggle button", () => {
        renderWithLocale(<UsersLayoutClient {...defaultProps} />, locale);

        const toggleBtn = screen.getByRole("button", {
          name: new RegExp(`${users.collapseMenu}|${users.expandMenu}`),
        });
        expect(toggleBtn).toBeInTheDocument();
      });

      it("displays navigation labels in correct locale", () => {
        renderWithLocale(<UsersLayoutClient {...defaultProps} />, locale);

        expect(screen.getByText(users.title)).toBeInTheDocument();
        expect(screen.getByText(users.nav.skills)).toBeInTheDocument();
        expect(screen.getByText(users.nav.languages)).toBeInTheDocument();
        expect(screen.getByText(users.nav.cvs)).toBeInTheDocument();
      });
    });

    describe("sidebar toggle", () => {
      it("collapses sidebar when toggle is clicked", async () => {
        const user = userEvent.setup();
        const { container } = renderWithLocale(
          <UsersLayoutClient {...defaultProps} />,
          locale,
        );

        const toggleBtn = screen.getByRole("button", {
          name: users.collapseMenu,
        });
        await user.click(toggleBtn);

        const aside = container.querySelector("aside");
        expect(aside?.className).toContain("w-16");
      });

      it("expands sidebar when collapsed and toggle is clicked", async () => {
        const user = userEvent.setup();
        const { container } = renderWithLocale(
          <UsersLayoutClient {...defaultProps} />,
          locale,
        );

        const toggleBtn = screen.getByRole("button", {
          name: users.collapseMenu,
        });
        await user.click(toggleBtn);

        const expandBtn = screen.getByRole("button", {
          name: users.expandMenu,
        });
        await user.click(expandBtn);

        const aside = container.querySelector("aside");
        expect(aside?.className).toContain("w-56");
      });

      it("hides nav labels when sidebar is collapsed", async () => {
        const user = userEvent.setup();
        renderWithLocale(<UsersLayoutClient {...defaultProps} />, locale);

        const navLabel = screen.getByText(users.title);
        expect(navLabel).not.toHaveClass("hidden");

        const toggleBtn = screen.getByRole("button", {
          name: users.collapseMenu,
        });
        await user.click(toggleBtn);

        expect(navLabel).toHaveClass("hidden");
      });
    });

    describe("profile link", () => {
      it("navigates to /users/me on profile click", () => {
        renderWithLocale(<UsersLayoutClient {...defaultProps} />, locale);

        const profileLink = screen
          .getAllByTestId("mock-link")
          .find(
            (link: HTMLElement) => link.getAttribute("href") === "/users/me",
          );

        expect(profileLink).toBeInTheDocument();
      });

      it("displays fallback initials when no avatar", () => {
        renderWithLocale(<UsersLayoutClient {...defaultProps} />, locale);
        const fallback = screen.getByTestId("mock-avatar-fallback");
        expect(fallback).toHaveTextContent("AB");
      });

      it("displays avatar image when provided", () => {
        const userWithAvatar = {
          ...mockInitialUser,
          profile: { ...mockInitialUser.profile, avatar: "/avatar.jpg" },
        };
        useUserStore.setState({ user: userWithAvatar });

        renderWithLocale(
          <UsersLayoutClient {...defaultProps} initialUser={userWithAvatar} />,
          locale,
        );

        expect(screen.getByTestId("mock-avatar-image")).toHaveAttribute(
          "src",
          "/avatar.jpg",
        );
      });
    });

    describe("edge cases", () => {
      it("handles null currentUser gracefully", () => {
        useUserStore.setState({ user: null });
        renderWithLocale(
          <UsersLayoutClient {...defaultProps} initialUser={null} />,
          locale,
        );

        const fallback = screen.getByTestId("mock-avatar-fallback");
        expect(fallback).toHaveTextContent("U");
        expect(screen.getByText(users.defaultUser)).toBeInTheDocument();
      });

      it("handles empty name fields", () => {
        const emptyUser = {
          ...mockInitialUser,
          profile: { first_name: "", last_name: "", avatar: null },
        };
        useUserStore.setState({ user: emptyUser });

        renderWithLocale(
          <UsersLayoutClient {...defaultProps} initialUser={emptyUser} />,
          locale,
        );

        expect(screen.getByText(users.defaultUser)).toBeInTheDocument();
      });

      it("renders children in main content area", () => {
        renderWithLocale(<UsersLayoutClient {...defaultProps} />, locale);

        expect(screen.getByTestId("mock-children")).toBeInTheDocument();
      });
    });
  });
});
