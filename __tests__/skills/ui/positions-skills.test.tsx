import { useTranslations } from "next-intl";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  getSkillsColumns,
  type SkillWithExtras,
} from "@/components/skills/ui/skills-columns";

describe("getSkillsColumns", () => {
  const mockTCommon = jest.fn((key: string) => key) as unknown as ReturnType<
    typeof useTranslations
  >;

  const mockOnSort = jest.fn();

  const baseArgs = {
    tCommon: mockTCommon,
    sortField: "name" as keyof SkillWithExtras,
    sortOrder: "asc" as const,
    onSort: mockOnSort,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return exactly 2 columns (Name and Category)", () => {
    const columns = getSkillsColumns(baseArgs);

    expect(columns).toHaveLength(2);

    expect(
      columns[0].render({ id: "1", name: "React" } as SkillWithExtras),
    ).toBe("React");

    expect(
      columns[1].render({
        id: "1",
        name: "React",
        category: { id: "cat-1", name: "Frontend" },
      } as SkillWithExtras),
    ).toBe("Frontend");

    expect(
      columns[1].render({
        id: "2",
        name: "Unknown Skill",
        category: null,
      } as unknown as SkillWithExtras),
    ).toBe("—");
  });

  it("should call onSort with 'name' when clicking on the Name column header", async () => {
    const user = userEvent.setup();
    const columns = getSkillsColumns(baseArgs);

    render(columns[0].header as React.ReactElement);

    const headerTitle = screen.getByText("fields.name");
    await user.click(headerTitle);

    expect(mockOnSort).toHaveBeenCalledWith("name");
  });

  it("should call onSort with 'categoryName' when clicking on the Category column header", async () => {
    const user = userEvent.setup();
    const columns = getSkillsColumns(baseArgs);

    render(columns[1].header as React.ReactElement);

    const headerTitle = screen.getByText("fields.category");
    await user.click(headerTitle);

    expect(mockOnSort).toHaveBeenCalledWith("categoryName");
  });
});
