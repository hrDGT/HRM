import { render, screen } from "@testing-library/react";

import { FormActions } from "@/components/forms/ui/form-actions";

describe("FormActions Component", () => {
  const defaultProps = {
    formId: "auth-form",
    buttonText: "Sign In",
    linkText: "Create an account",
    linkHref: "/signup",
    isPending: false,
  };

  it("renders the submit button and link with correct attributes", () => {
    render(<FormActions {...defaultProps} />);

    const submitButton = screen.getByRole("button", { name: "Sign In" });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).not.toBeDisabled();
    expect(submitButton).toHaveAttribute("form", "auth-form");
    expect(submitButton).toHaveAttribute("type", "submit");

    const linkElement = screen.getByRole("link", { name: "Create an account" });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/signup");
  });

  it("disables the button and shows 'Loading...' when isPending is true", () => {
    render(<FormActions {...defaultProps} isPending={true} />);

    const loadingButton = screen.getByRole("button", { name: "Loading..." });
    expect(loadingButton).toBeInTheDocument();

    expect(loadingButton).toBeDisabled();

    expect(
      screen.queryByRole("button", { name: "Sign In" }),
    ).not.toBeInTheDocument();
  });
});
