import { render, screen } from "@testing-library/react";
import { FormRootError } from "@/components/auth/form-root-error";

jest.mock("@/components/ui/field.tsx", () => ({
  FieldError: ({ errors }: { errors: { message: string }[] }) => (
    <div data-testid="field-error">{errors[0].message}</div>
  ),
}));

describe("FormRootError Component", () => {
  it("renders null when no message is provided", () => {
    const { container } = render(<FormRootError />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the error message when provided", () => {
    render(<FormRootError message="Invalid credentials" />);

    const errorElement = screen.getByTestId("field-error");
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent("Invalid credentials");
  });
});
