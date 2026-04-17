import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { LoginForm } from "@/components/auth/ui/login-form";

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

    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(
      screen.getByText("Hello again! Log in to continue"),
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Forgot password" }),
    ).toBeInTheDocument();
  });

  it("calls the form action with valid data on submit", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByRole("button", { name: "Log in" });

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

    const emailInput = screen.getByPlaceholderText("Email");
    const submitButton = screen.getByRole("button", { name: "Log in" });

    await user.type(emailInput, "not-an-email");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockFormAction).not.toHaveBeenCalled();
    });
  });

  it("displays a root error message if the server action returns an error", () => {
    jest
      .spyOn(React, "useActionState")
      .mockReturnValue([
        { error: "Invalid email or password" },
        mockFormAction,
        false,
      ]);

    render(<LoginForm />);

    expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
  });

  it("disables the submit button and shows loading state when isPending is true", () => {
    jest
      .spyOn(React, "useActionState")
      .mockReturnValue([null, mockFormAction, true]);

    render(<LoginForm />);

    const loadingButton = screen.getByRole("button", { name: "Loading..." });

    expect(loadingButton).toBeInTheDocument();
    expect(loadingButton).toBeDisabled();

    expect(
      screen.queryByRole("button", { name: "Log in" }),
    ).not.toBeInTheDocument();
  });
});
