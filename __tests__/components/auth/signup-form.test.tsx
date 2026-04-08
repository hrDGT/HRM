import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SignupForm } from "@/components/auth/signup/signup-form";

jest.mock("@/components/auth/signup/signup-action", () => ({
  signUpUserAction: jest.fn(),
}));

describe("SignupForm Component", () => {
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
    render(<SignupForm />);

    expect(screen.getByText("Register now")).toBeInTheDocument();
    expect(
      screen.getByText("Welcome! Sign up to continue"),
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Create account" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "I have an account" }),
    ).toBeInTheDocument();
  });

  it("calls the form action with valid data on submit", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByRole("button", { name: "Create account" });

    await user.type(emailInput, "newuser@example.com");
    await user.type(passwordInput, "StrongPassword123!");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockFormAction).toHaveBeenCalledTimes(1);
      expect(mockFormAction).toHaveBeenCalledWith({
        email: "newuser@example.com",
        password: "StrongPassword123!",
      });
    });
  });

  it("blocks submission and shows validation errors on invalid data", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    const emailInput = screen.getByPlaceholderText("Email");
    const submitButton = screen.getByRole("button", { name: "Create account" });

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
        { error: "User with this email already exists" },
        mockFormAction,
        false,
      ]);

    render(<SignupForm />);

    expect(
      screen.getByText("User with this email already exists"),
    ).toBeInTheDocument();
  });

  it("disables the submit button and shows loading state when isPending is true", () => {
    jest
      .spyOn(React, "useActionState")
      .mockReturnValue([null, mockFormAction, true]);

    render(<SignupForm />);

    const loadingButton = screen.getByRole("button", { name: "Loading..." });

    expect(loadingButton).toBeInTheDocument();
    expect(loadingButton).toBeDisabled();

    expect(
      screen.queryByRole("button", { name: "Create account" }),
    ).not.toBeInTheDocument();
  });
});
