import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { Form } from "@/components/forms/form";

const FormTestWrapper = ({
  onSubmit,
  id,
  className,
}: {
  onSubmit: jest.Mock;
  id?: string;
  className?: string;
}) => {
  const form = useForm({
    defaultValues: {
      testField: "",
    },
  });

  return (
    <Form form={form} onSubmit={onSubmit} id={id} className={className}>
      <input {...form.register("testField")} placeholder="Type something" />
      <button type="submit">Submit Form</button>
    </Form>
  );
};

describe("Form Component", () => {
  it("renders the form element with correct id, className, and children", () => {
    const mockSubmit = jest.fn();
    const { container } = render(
      <FormTestWrapper
        onSubmit={mockSubmit}
        id="test-form"
        className="custom-class"
      />,
    );

    const formElement = container.querySelector("form");

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

    render(<FormTestWrapper onSubmit={mockSubmit} />);

    const input = screen.getByPlaceholderText("Type something");
    const submitButton = screen.getByRole("button", { name: "Submit Form" });

    await user.type(input, "Hello World");

    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledTimes(1);
    });

    expect(mockSubmit).toHaveBeenCalledWith(
      { testField: "Hello World" },
      expect.anything(),
    );
  });
});
