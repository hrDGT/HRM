import { usePathname } from "next/navigation";
import { render, screen } from "@testing-library/react";

import { AuthTab } from "@/components/auth/ui/auth-tab";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

describe("AuthTab Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    title: "Sign In",
    href: "/auth/login",
  };

  it("renders a link with the correct title and href", () => {
    (usePathname as jest.Mock).mockReturnValue("/some/other/path");

    render(<AuthTab {...defaultProps} />);

    const link = screen.getByRole("link", { name: "Sign In" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/auth/login");
  });

  it("applies the active styling (text-main-red) when pathname matches href", () => {
    (usePathname as jest.Mock).mockReturnValue("/auth/login");

    render(<AuthTab {...defaultProps} />);

    const link = screen.getByRole("link", { name: "Sign In" });

    expect(link).toHaveClass("text-main-red");
    expect(link).not.toHaveClass("text-secondary-text");
  });

  it("applies the inactive styling when pathname does not match href", () => {
    (usePathname as jest.Mock).mockReturnValue("/auth/signup");

    render(<AuthTab {...defaultProps} />);

    const link = screen.getByRole("link", { name: "Sign In" });

    expect(link).toHaveClass("text-secondary-text");
    expect(link).toHaveClass("hover:text-main-text");
    expect(link).not.toHaveClass("text-main-red");
  });
});
