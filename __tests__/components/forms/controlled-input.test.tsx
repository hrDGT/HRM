import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ControlledInput } from "@/components/forms/form-input";

const TestWrapper = ({
  children,
  shouldSetError = false,
}: {
  children: React.ReactNode;
  shouldSetError?: boolean;
}) => {
  const methods = useForm({
    defaultValues: { testField: "" },
  });

  useEffect(() => {
    if (shouldSetError) {
      methods.setError("testField", {
        type: "manual",
        message: "This field is required",
      });
    }
  }, [methods, shouldSetError]);

  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe("ControlledInput Component", () => {
  it("renders correctly with given props", () => {
    render(
      <TestWrapper>
        <ControlledInput
          name="testName"
          placeholder="Enter your email"
          type="email"
        />
      </TestWrapper>,
    );

    const input = screen.getByPlaceholderText("Enter your email");

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("name", "testName");
    expect(input).toHaveAttribute("placeholder", "Enter your email");
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("aria-invalid", "false");
    expect(input).toHaveAttribute("autoComplete", "email");
  });

  it("allows the user to type into the input", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <ControlledInput name="testField" placeholder="Type here" />
      </TestWrapper>,
    );

    const input = screen.getByPlaceholderText("Type here");
    await user.type(input, "Some text");

    expect(input).toHaveValue("Some text");
  });

  it("displays an error message and updates attributes when the field is invalid", async () => {
    render(
      <TestWrapper shouldSetError={true}>
        <ControlledInput name="testField" placeholder="Type here" />
      </TestWrapper>,
    );

    const input = screen.getByPlaceholderText("Type here");

    await waitFor(() => {
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    const errorMessage = screen.getByText("This field is required");
    expect(errorMessage).toBeInTheDocument();
  });
});
