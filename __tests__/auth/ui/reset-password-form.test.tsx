import React from "react";
import { useSearchParams } from "next/navigation";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useActionFeedback } from "@/components/auth/hooks/use-action-feedback";
import { ResetPasswordForm } from "@/components/auth/ui/reset-password-form";

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

    expect(screen.getByText("Set a new password")).toBeInTheDocument();
    expect(
      screen.getByText("Almost done! Now create a new password"),
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Back to log in" }),
    ).toBeInTheDocument();
  });

  it("calls the form action with the new password on submit", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm />);

    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByRole("button", { name: "Submit" });

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
    jest
      .spyOn(React, "useActionState")
      .mockReturnValue([
        { error: "Reset token has expired or is invalid" },
        mockFormAction,
        false,
      ]);

    render(<ResetPasswordForm />);

    expect(
      screen.getByText("Reset token has expired or is invalid"),
    ).toBeInTheDocument();
  });

  it("disables the submit button and shows loading state when isPending is true", () => {
    jest
      .spyOn(React, "useActionState")
      .mockReturnValue([null, mockFormAction, true]);

    render(<ResetPasswordForm />);

    const loadingButton = screen.getByRole("button", { name: "Loading..." });
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
      "Password has been reset",
      "/auth/login",
    );
  });
});
