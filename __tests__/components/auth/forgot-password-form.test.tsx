import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ForgotPasswordForm } from "@/components/auth/forgot-password/forgot-password-form";
import { useActionFeedback } from "@/hooks/auth/use-action-feedback";

jest.mock("@/hooks/auth/use-action-feedback", () => ({
  useActionFeedback: jest.fn(),
}));

jest.mock("@/components/auth/forgot-password/forgot-password-action", () => ({
  forgotPasswordAction: jest.fn(),
}));

describe("ForgotPasswordForm Component", () => {
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
    render(<ForgotPasswordForm />);

    expect(screen.getByText("Forgot password")).toBeInTheDocument();
    expect(
      screen.getByText("We will sent you an email with further instructions"),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Reset password" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Cancel" })).toBeInTheDocument();
  });

  it("calls the form action with valid data on submit", async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    const emailInput = screen.getByPlaceholderText("Email");
    const submitButton = screen.getByRole("button", { name: "Reset password" });

    await user.type(emailInput, "test@example.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockFormAction).toHaveBeenCalledTimes(1);
      expect(mockFormAction).toHaveBeenCalledWith({
        email: "test@example.com",
      });
    });
  });

  it("does not call the form action if validation fails", async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    const emailInput = screen.getByPlaceholderText("Email");
    const submitButton = screen.getByRole("button", { name: "Reset password" });

    await user.type(emailInput, "not-an-email");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockFormAction).not.toHaveBeenCalled();
    });
  });

  it("displays a root error message if the action state contains an error", () => {
    jest
      .spyOn(React, "useActionState")
      .mockReturnValue([
        { error: "User not found in the system" },
        mockFormAction,
        false,
      ]);

    render(<ForgotPasswordForm />);

    expect(
      screen.getByText("User not found in the system"),
    ).toBeInTheDocument();
  });

  it("disables the submit button when isPending is true", () => {
    jest
      .spyOn(React, "useActionState")
      .mockReturnValue([null, mockFormAction, true]);

    render(<ForgotPasswordForm />);

    const loadingButton = screen.getByRole("button", { name: "Loading..." });
    expect(loadingButton).toBeInTheDocument();
    expect(loadingButton).toBeDisabled();
  });

  it("passes the correct state to useActionFeedback", () => {
    jest
      .spyOn(React, "useActionState")
      .mockReturnValue([{ success: true }, mockFormAction, false]);

    render(<ForgotPasswordForm />);

    expect(useActionFeedback).toHaveBeenCalledWith(
      true,
      "Check your email inbox",
      "/auth/login",
    );
  });
});
