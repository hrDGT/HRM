import { useFormContext } from "react-hook-form";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { z } from "zod";

import { Form } from "@/components/forms/form";

const testSchema = z.object({
  testField: z.string().min(1, "Required"),
});
type TestValues = z.infer<typeof testSchema>;

const TestInput = () => {
  const { register } = useFormContext<TestValues>();
  return <input {...register("testField")} placeholder="Type something" />;
};
const FormTestWrapper = ({
  onSubmit,
  id,
  className,
}: {
  onSubmit: jest.Mock;
  id: string;
  className?: string;
}) => {
  return (
    <Form<TestValues>
      schema={testSchema}
      defaultValues={{ testField: "" }}
      onSubmit={onSubmit}
      id={id}
      className={className}
      aria-label="test-form"
    >
      <TestInput />
      <button type="submit">Submit Form</button>
    </Form>
  );
};

describe("Form Component", () => {
  it("renders the form element with correct id, className, and children", () => {
    const mockSubmit = jest.fn();
    render(
      <FormTestWrapper
        onSubmit={mockSubmit}
        id="test-form"
        className="custom-class"
      />,
    );

    const formElement = screen.getByRole("form");

    expect(formElement).toBeInTheDocument();
    expect(formElement).toHaveAttribute("id", "test-form");
    expect(formElement).toHaveClass("custom-class");

    expect(screen.getByPlaceholderText("Type something")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Submit Form" }),
    ).toBeInTheDocument();
  });

  it("calls the onSubmit handler with correct data when submitted", async () => {
    const mockSubmit = jest.fn();
    const user = userEvent.setup();

    render(<FormTestWrapper onSubmit={mockSubmit} id="submit-test-form" />);

    const input = screen.getByPlaceholderText("Type something");
    const submitButton = screen.getByRole("button", { name: "Submit Form" });

    await user.type(input, "Hello World");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ testField: "Hello World" }),
        expect.anything(),
      );
    });
  });
});
