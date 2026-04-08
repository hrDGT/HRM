import { usePathname } from "next/navigation";
import { render, screen } from "@testing-library/react";

import { AuthHeader } from "@/components/auth/auth-header";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

jest.mock("@/components/auth/auth-tab", () => ({
  AuthTab: jest.fn(({ title, href }) => (
    <a href={href} data-testid="mock-auth-tab">
      {title}
    </a>
  )),
}));

describe("AuthHeader Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders both tabs correctly", () => {
    (usePathname as jest.Mock).mockReturnValue("/auth/login");
    render(<AuthHeader />);

    expect(screen.getByText("Sign In")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
    expect(screen.getAllByTestId("mock-auth-tab")).toHaveLength(2);
  });

  it("positions the animated line to the left (translate-x-0) on the login route", () => {
    (usePathname as jest.Mock).mockReturnValue("/auth/login");

    const { container } = render(<AuthHeader />);
    const animatedLine = container.querySelector(".bg-main-red");

    expect(animatedLine).toBeInTheDocument();
    expect(animatedLine).toHaveClass("translate-x-0");
    expect(animatedLine).not.toHaveClass("translate-x-full");
  });

  it("positions the animated line to the right (translate-x-full) on the signup route", () => {
    (usePathname as jest.Mock).mockReturnValue("/auth/signup");

    const { container } = render(<AuthHeader />);
    const animatedLine = container.querySelector(".bg-main-red");

    expect(animatedLine).toBeInTheDocument();
    expect(animatedLine).toHaveClass("translate-x-full");
    expect(animatedLine).not.toHaveClass("translate-x-0");
  });

  it("defaults the animated line to the left (translate-x-0) on unknown routes", () => {
    (usePathname as jest.Mock).mockReturnValue("/auth/forgot-password");

    const { container } = render(<AuthHeader />);
    const animatedLine = container.querySelector(".bg-main-red");

    expect(animatedLine).toHaveClass("translate-x-0");
  });
});
