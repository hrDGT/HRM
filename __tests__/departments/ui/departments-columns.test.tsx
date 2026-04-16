import { useTranslations } from "next-intl";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { getDepartmentColumns } from "@/components/departments/ui/departments-columns";

describe("getDepartmentColumns", () => {
  const mockT = jest.fn((key: string) => key) as unknown as ReturnType<
    typeof useTranslations
  >;
  const mockTCommon = jest.fn((key: string) => key) as unknown as ReturnType<
    typeof useTranslations
  >;

  const mockOnSort = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const baseArgs = {
    t: mockT,
    tCommon: mockTCommon,
    isPending: false,
    sortField: "name" as const,
    sortOrder: "asc" as const,
    onSort: mockOnSort,
    onEdit: mockOnEdit,
    onDelete: mockOnDelete,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 1 column (only Name) for a regular user", () => {
    const columns = getDepartmentColumns({ ...baseArgs, isAdmin: false });

    expect(columns).toHaveLength(1);
    expect(columns[0].render({ id: "1", name: "Test dep" })).toBe("Test dep");
  });

  it("should return 2 columns (Name + Actions) for an Admin", () => {
    const columns = getDepartmentColumns({ ...baseArgs, isAdmin: true });

    expect(columns).toHaveLength(2);
    expect(columns[1].header).toBe("");
  });

  it("should call onSort when clicking on the column header", async () => {
    const user = userEvent.setup();
    const columns = getDepartmentColumns({ ...baseArgs, isAdmin: false });

    render(columns[0].header as React.ReactElement);

    const headerTitle = screen.getByText("fields.name");
    await user.click(headerTitle);

    expect(mockOnSort).toHaveBeenCalledWith("name");
  });
});
