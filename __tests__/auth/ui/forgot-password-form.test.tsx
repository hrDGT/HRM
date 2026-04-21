import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useActionFeedback } from "@/components/auth/hooks/use-action-feedback";
import { ForgotPasswordForm } from "@/components/auth/ui/forgot-password-form";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("@/components/auth/hooks/use-action-feedback", () => ({
  useActionFeedback: jest.fn(),
}));

jest.mock("@/components/auth/actions/forgot-password-action", () => ({
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

    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByText("subtitle")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("fields.email")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "submitAction" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "cancelAction" }),
    ).toBeInTheDocument();
  });

  it("calls the form action with valid data on submit", async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    const emailInput = screen.getByPlaceholderText("fields.email");
    const submitButton = screen.getByRole("button", { name: "submitAction" });

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

    const emailInput = screen.getByPlaceholderText("fields.email");
    const submitButton = screen.getByRole("button", { name: "submitAction" });

    await user.type(emailInput, "not-an-email");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockFormAction).not.toHaveBeenCalled();
    });
  });

  it("displays a root error message if the action state contains an error", () => {
    const errorMsg = "User not found in the system";
    jest
      .spyOn(React, "useActionState")
      .mockReturnValue([{ error: errorMsg }, mockFormAction, false]);

    render(<ForgotPasswordForm />);

    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });

  it("disables the submit button when isPending is true", () => {
    jest
      .spyOn(React, "useActionState")
      .mockReturnValue([null, mockFormAction, true]);

    render(<ForgotPasswordForm />);

    const loadingButton = screen.getByRole("button", {
      name: /loading|confirming/i,
    });
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
      "success",
      "/auth/login",
    );
  });
});
