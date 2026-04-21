import { useTranslations } from "next-intl";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { getLanguagesColumns } from "@/components/languages/ui/languages-columns";
import { type Language } from "@/components/languages/ui/languages-page-content";

describe("getLanguagesColumns", () => {
  const mockTCommon = jest.fn((key: string) => key) as unknown as ReturnType<
    typeof useTranslations
  >;

  const mockOnSort = jest.fn();

  const baseArgs = {
    tCommon: mockTCommon,
    sortField: "name" as keyof Language,
    sortOrder: "asc" as const,
    onSort: mockOnSort,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return exactly 3 columns (Name, Native Name, and Iso2)", () => {
    const columns = getLanguagesColumns(baseArgs);

    expect(columns).toHaveLength(3);

    const mockLanguage = {
      id: "1",
      name: "English",
      iso2: "EN",
      native_name: "English",
    } as Language;

    expect(columns[0].render(mockLanguage)).toBe("English");
    expect(columns[1].render(mockLanguage)).toBe("English");
    expect(columns[2].render(mockLanguage)).toBe("EN");

    const mockLanguageWithoutNative = {
      id: "2",
      name: "Unknown",
      iso2: "UN",
      native_name: null,
    } as unknown as Language;

    expect(columns[1].render(mockLanguageWithoutNative)).toBe("—");
  });

  it("should call onSort with 'name' when clicking on the Name column header", async () => {
    const user = userEvent.setup();
    const columns = getLanguagesColumns(baseArgs);

    render(columns[0].header as React.ReactElement);

    const headerTitle = screen.getByText("fields.name");
    await user.click(headerTitle);

    expect(mockOnSort).toHaveBeenCalledWith("name");
  });

  it("should call onSort with 'native_name' when clicking on the Native Name column header", async () => {
    const user = userEvent.setup();
    const columns = getLanguagesColumns(baseArgs);

    render(columns[1].header as React.ReactElement);

    const headerTitle = screen.getByText("fields.nativeName");
    await user.click(headerTitle);

    expect(mockOnSort).toHaveBeenCalledWith("native_name");
  });

  it("should call onSort with 'iso2' when clicking on the Iso2 column header", async () => {
    const user = userEvent.setup();
    const columns = getLanguagesColumns(baseArgs);

    render(columns[2].header as React.ReactElement);

    const headerTitle = screen.getByText("fields.iso2");
    await user.click(headerTitle);

    expect(mockOnSort).toHaveBeenCalledWith("iso2");
  });
});
