import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { UsersLayoutClient } from "@/app/users/_components/users-layout-client";

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
    <div data-testid="mock-avatar" className={className}>{children}</div>
  ),
  AvatarImage: ({ src }: any) => <img data-testid="mock-avatar-image" src={src} />,
  AvatarFallback: ({ children, className }: any) => (
    <span data-testid="mock-avatar-fallback" className={className}>{children}</span>
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

const mockCurrentUser = {
  id: 1,
  firstName: "Alice",
  lastName: "Brown",
  avatar: null,
};

const defaultProps = {
  currentUser: mockCurrentUser,
  children: <div data-testid="mock-children">Page Content</div>,
};

describe("UsersLayoutClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("sidebar rendering", () => {
    it("renders navigation items", () => {
      render(<UsersLayoutClient {...defaultProps} />);
      
      const links = screen.getAllByTestId("mock-link");
      const linkHrefs = links.map((link: HTMLElement) => link.getAttribute("href"));
      
      expect(linkHrefs).toContain("/users");
      expect(linkHrefs).toContain("/skills");
      expect(linkHrefs).toContain("/languages");
      expect(linkHrefs).toContain("/cvs");
    });

    it("renders profile section with user initials", () => {
      render(<UsersLayoutClient {...defaultProps} />);
      
      const fallback = screen.getByTestId("mock-avatar-fallback");
      expect(fallback).toHaveTextContent("AB");
    });

    it("renders user display name", () => {
      render(<UsersLayoutClient {...defaultProps} />);
      
      expect(screen.getByText("Alice Brown")).toBeInTheDocument();
    });

    it("renders collapse/expand toggle button", () => {
      render(<UsersLayoutClient {...defaultProps} />);
      
      const toggleBtn = screen.getByRole("button", { name: /Свернуть меню|Развернуть меню/ });
      expect(toggleBtn).toBeInTheDocument();
    });
  });

  describe("sidebar toggle", () => {
    it("collapses sidebar when toggle is clicked", async () => {
      const user = userEvent.setup();
      const { container } = render(<UsersLayoutClient {...defaultProps} />);
      
      const toggleBtn = screen.getByRole("button", { name: /Свернуть меню/ });
      await user.click(toggleBtn);
      
      const aside = container.querySelector("aside");
      expect(aside?.className).toContain("w-16");
    });

    it("expands sidebar when collapsed and toggle is clicked", async () => {
      const user = userEvent.setup();
      const { container } = render(<UsersLayoutClient {...defaultProps} />);
      
      const toggleBtn = screen.getByRole("button", { name: /Свернуть меню/ });
      await user.click(toggleBtn);
      
      const expandBtn = screen.getByRole("button", { name: /Развернуть меню/ });
      await user.click(expandBtn);
      
      const aside = container.querySelector("aside");
      expect(aside?.className).toContain("w-56");
    });

    it("hides nav labels when sidebar is collapsed", async () => {
      const user = userEvent.setup();
      render(<UsersLayoutClient {...defaultProps} />);
      
      const navLabel = screen.getByText("Employees");
      expect(navLabel).not.toHaveClass("hidden");
      
      const toggleBtn = screen.getByRole("button", { name: /Свернуть меню/ });
      await user.click(toggleBtn);
      
      expect(navLabel).toHaveClass("hidden");
    });
  });

  describe("profile link", () => {
    it("navigates to /users/me on profile click", () => {
      render(<UsersLayoutClient {...defaultProps} />);
      
      const profileLink = screen.getAllByTestId("mock-link").find(
        (link: HTMLElement) => link.getAttribute("href") === "/users/me"
      );
      
      expect(profileLink).toBeInTheDocument();
    });

    it("displays fallback initials when no avatar", () => {
      render(<UsersLayoutClient {...defaultProps} />);
      
      expect(screen.getByTestId("mock-avatar-fallback")).toHaveTextContent("AB");
      expect(screen.queryByTestId("mock-avatar-image")).not.toBeInTheDocument();
    });

    it("displays avatar image when provided", () => {
      render(
        <UsersLayoutClient
          {...defaultProps}
          currentUser={{ ...mockCurrentUser, avatar: "/avatar.jpg" }}
        />
      );
      
      expect(screen.getByTestId("mock-avatar-image")).toHaveAttribute("src", "/avatar.jpg");
    });
  });

  describe("edge cases", () => {
    it("handles null currentUser gracefully", () => {
      render(<UsersLayoutClient {...defaultProps} currentUser={null} />);
      
      const fallback = screen.getByTestId("mock-avatar-fallback");
      expect(fallback).toHaveTextContent("U");
      expect(screen.getByText("User")).toBeInTheDocument();
    });

    it("handles empty name fields", () => {
      render(
        <UsersLayoutClient
          {...defaultProps}
          currentUser={{ id: 1, firstName: "", lastName: "", avatar: null }}
        />
      );
      
      expect(screen.getByText("User")).toBeInTheDocument();
    });

    it("renders children in main content area", () => {
      render(<UsersLayoutClient {...defaultProps} />);
      
      expect(screen.getByTestId("mock-children")).toBeInTheDocument();
    });
  });
});
