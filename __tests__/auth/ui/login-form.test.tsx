import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { LoginForm } from "@/components/auth/ui/login-form";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("@/components/auth/actions/login-action", () => ({
  loginUserAction: jest.fn(),
}));

describe("LoginForm Component", () => {
  let mockFormAction: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFormAction = jest.fn();

    jest
      .spyOn(React, "useActionState")
      .mockReturnValue([null, mockFormAction, false]);

    jest.spyOn(React, "startTransition").mockImplementation((cb) => cb());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders all form elements correctly", () => {
    render(<LoginForm />);

    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByText("subtitle")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("fields.email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("fields.password")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "submitAction" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "forgotPasswordAction" }),
    ).toBeInTheDocument();
  });

  it("calls the form action with valid data on submit", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText("fields.email");
    const passwordInput = screen.getByPlaceholderText("fields.password");
    const submitButton = screen.getByRole("button", { name: "submitAction" });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "SecurePassword123!");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockFormAction).toHaveBeenCalledTimes(1);
      expect(mockFormAction).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "SecurePassword123!",
      });
    });
  });

  it("blocks submission and shows validation errors on invalid data", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText("fields.email");
    const submitButton = screen.getByRole("button", { name: "submitAction" });

    await user.type(emailInput, "not-an-email");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockFormAction).not.toHaveBeenCalled();
    });
  });

  it("displays a root error message if the server action returns an error", () => {
    const errorMessage = "Invalid email or password";
    jest
      .spyOn(React, "useActionState")
      .mockReturnValue([{ error: errorMessage }, mockFormAction, false]);

    render(<LoginForm />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("disables the submit button and shows loading state when isPending is true", () => {
    jest
      .spyOn(React, "useActionState")
      .mockReturnValue([null, mockFormAction, true]);

    render(<LoginForm />);

    const loadingButton = screen.getByRole("button", { name: /loading/i });

    expect(loadingButton).toBeInTheDocument();
    expect(loadingButton).toBeDisabled();

    expect(
      screen.queryByRole("button", { name: "submitAction" }),
    ).not.toBeInTheDocument();
  });
});
