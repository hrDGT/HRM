import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ControlledPasswordInput } from "@/components/forms/controlled-password-input";

const TestWrapper = ({
  children,
  shouldSetError = false,
}: {
  children: React.ReactNode;
  shouldSetError?: boolean;
}) => {
  const methods = useForm({
    defaultValues: { testPassword: "" },
  });

  useEffect(() => {
    if (shouldSetError) {
      methods.setError("testPassword", {
        type: "manual",
        message: "Password is too short",
      });
    }
  }, [methods, shouldSetError]);

  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe("ControlledPasswordInput Component", () => {
  it("renders as a hidden password field by default", () => {
    render(
      <TestWrapper>
        <ControlledPasswordInput
          name="testPassword"
          placeholder="Enter password"
        />
      </TestWrapper>,
    );
    const input = screen.getByPlaceholderText("Enter password");

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "password");
    expect(
      screen.getByRole("button", { name: "Show password" }),
    ).toBeInTheDocument();
  });

  it("toggles password visibility when the eye button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <ControlledPasswordInput name="testPassword" placeholder="Password" />
      </TestWrapper>,
    );

    const input = screen.getByPlaceholderText("Password");
    const toggleButton = screen.getByRole("button", { name: "Show password" });

    await user.click(toggleButton);
    expect(input).toHaveAttribute("type", "text");
    expect(
      screen.getByRole("button", { name: "Hide password" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Hide password" }));
    expect(input).toHaveAttribute("type", "password");
    expect(
      screen.getByRole("button", { name: "Show password" }),
    ).toBeInTheDocument();
  });

  it("renders as plain text and hides icons when hasProtectIcon is false", () => {
    render(
      <TestWrapper>
        <ControlledPasswordInput
          name="testPassword"
          placeholder="Password"
          hasProtectIcon={false}
        />
      </TestWrapper>,
    );

    const input = screen.getByPlaceholderText("Password");

    expect(input).toHaveAttribute("type", "text");

    const toggleButton = screen.getByRole("button", { name: "Hide password" });
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toBeEmptyDOMElement();
  });

  it("allows typing and displays errors correctly", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper shouldSetError={true}>
        <ControlledPasswordInput
          name="testPassword"
          placeholder="Type password"
        />
      </TestWrapper>,
    );

    const input = screen.getByPlaceholderText("Type password");

    await user.type(input, "123");
    expect(input).toHaveValue("123");

    await waitFor(() => {
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    const errorMessage = screen.getByText("Password is too short");
    expect(errorMessage).toBeInTheDocument();
  });
});
