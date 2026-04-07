import { render, screen } from "@testing-library/react";

import { FormHeader } from "@/components/forms/form-header";

describe("FormHeader Component", () => {
  it("renders the title and description correctly", () => {
    const testTitle = "Welcome Back";
    const testDescription = "Please enter your details to continue.";

    render(<FormHeader title={testTitle} description={testDescription} />);

    const titleElement = screen.getByText(testTitle);
    expect(titleElement).toBeInTheDocument();

    const descriptionElement = screen.getByText(testDescription);
    expect(descriptionElement).toBeInTheDocument();
  });
});
