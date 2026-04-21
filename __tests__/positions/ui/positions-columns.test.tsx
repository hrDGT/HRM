import { useTranslations } from "next-intl";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { getPositionsColumns } from "@/components/positions/ui/positions-columns";

describe("getPositionsColumns", () => {
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
    const columns = getPositionsColumns(baseArgs);

    expect(columns).toHaveLength(1);
    expect(columns[0].render({ id: "1", name: "Test pos" })).toBe("Test pos");
  });

  it("should call onSort when clicking on the column header", async () => {
    const user = userEvent.setup();
    const columns = getPositionsColumns(baseArgs);

    render(columns[0].header as React.ReactElement);

    const headerTitle = screen.getByText("fields.name");
    await user.click(headerTitle);

    expect(mockOnSort).toHaveBeenCalledWith("name");
  });
});
