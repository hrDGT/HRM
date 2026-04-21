import { useTranslations } from "next-intl";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { getDepartmentColumns } from "@/components/departments/ui/departments-columns";

describe("getDepartmentColumns", () => {
  const mockTCommon = jest.fn((key: string) => key) as unknown as ReturnType<
    typeof useTranslations
  >;

  const mockOnSort = jest.fn();
  const baseArgs = {
    tCommon: mockTCommon,
    sortField: "name" as const,
    sortOrder: "asc" as const,
    onSort: mockOnSort,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return exactly 1 column (Name) since actions are handled by DataTable", () => {
    const columns = getDepartmentColumns(baseArgs);

    expect(columns).toHaveLength(1);
    expect(columns[0].render({ id: "1", name: "Test dep" })).toBe("Test dep");
  });

  it("should call onSort when clicking on the column header", async () => {
    const user = userEvent.setup();
    const columns = getDepartmentColumns(baseArgs);

    render(columns[0].header as React.ReactElement);

    const headerTitle = screen.getByText("fields.name");
    await user.click(headerTitle);

    expect(mockOnSort).toHaveBeenCalledWith("name");
  });
});
