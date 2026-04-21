import React from "react";
import { useSearchParams } from "next/navigation";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useActionFeedback } from "@/components/auth/hooks/use-action-feedback";
import { ResetPasswordForm } from "@/components/auth/ui/reset-password-form";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));

jest.mock("@/components/auth/hooks/use-action-feedback", () => ({
  useActionFeedback: jest.fn(),
}));

jest.mock("@/components/auth/actions/reset-password-action", () => ({
  resetPasswordAction: jest.fn(),
}));

describe("ResetPasswordForm Component", () => {
  let mockFormAction: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFormAction = jest.fn();

    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue("fake-reset-token-123"),
    });

    jest
      .spyOn(React, "useActionState")
      .mockReturnValue([null, mockFormAction, false]);
    jest.spyOn(React, "startTransition").mockImplementation((cb) => cb());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders all form elements correctly", () => {
    render(<ResetPasswordForm />);

    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByText("subtitle")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("fields.newPassword")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "submitAction" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "backToLoginAction" }),
    ).toBeInTheDocument();
  });

  it("calls the form action with the new password on submit", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm />);

    const passwordInput = screen.getByPlaceholderText("fields.newPassword");
    const submitButton = screen.getByRole("button", { name: "submitAction" });

    await user.type(passwordInput, "NewSecurePassword123!");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockFormAction).toHaveBeenCalledTimes(1);
      expect(mockFormAction).toHaveBeenCalledWith({
        newPassword: "NewSecurePassword123!",
      });
    });
  });

  it("displays a root error message if the server action fails", () => {
    const serverError = "Reset token has expired or is invalid";
    jest
      .spyOn(React, "useActionState")
      .mockReturnValue([{ error: serverError }, mockFormAction, false]);

    render(<ResetPasswordForm />);

    expect(screen.getByText(serverError)).toBeInTheDocument();
  });

  it("disables the submit button and shows loading state when isPending is true", () => {
    jest
      .spyOn(React, "useActionState")
      .mockReturnValue([null, mockFormAction, true]);

    render(<ResetPasswordForm />);

    const loadingButton = screen.getByRole("button", {
      name: /loading|confirming/i,
    });
    expect(loadingButton).toBeInTheDocument();
    expect(loadingButton).toBeDisabled();
  });

  it("passes the correct success state to useActionFeedback", () => {
    jest
      .spyOn(React, "useActionState")
      .mockReturnValue([{ success: true }, mockFormAction, false]);

    render(<ResetPasswordForm />);

    expect(useActionFeedback).toHaveBeenCalledWith(
      true,
      "success",
      "/auth/login",
    );
  });
});
