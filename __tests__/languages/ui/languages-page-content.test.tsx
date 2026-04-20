"use client";

import { render, screen } from "@testing-library/react";

import { useTableLogic } from "@/components/dashboard/hooks/use-table-logic";
import { LanguagesPageContent } from "@/components/languages/ui/languages-page-content";

jest.mock("@/components/dashboard/hooks/use-table-logic");

jest.mock("next-intl", () => ({
  useTranslations: jest.fn((namespace) => (key: string) => {
    const messages: Record<string, string> = {
      title: "Languages",
      "fields.name": "Name",
      "fields.iso2": "Iso2",
      "fields.nativeName": "Native name",
      "noResults.title": "No results found",
      "noResults.description": "Try another search",
      "actions.resetSearch": "Reset Search",
    };
    return namespace === "Common" ? messages[key] || key : messages[key] || key;
  }),
}));

jest.mock("next-intl/server", () => ({
  getTranslations: jest.fn(() => Promise.resolve((key: string) => key)),
}));

jest.mock("@/components/languages/actions/delete-languages-action", () => ({
  deleteLanguageAction: jest.fn(),
}));

jest.mock("@/components/languages/actions/create-languages-action", () => ({
  createLanguageAction: jest.fn(),
}));

jest.mock("@/components/languages/actions/update-languages-action", () => ({
  updateLanguageAction: jest.fn(),
}));

describe("LanguagesPageContent", () => {
  const mockInitialLanguages = [
    { id: "1", name: "English", iso2: "EN", native_name: "English (Native)" },
    { id: "2", name: "Russian", iso2: "RU", native_name: "Русский" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the header and data table correctly", () => {
    (useTableLogic as jest.Mock).mockReturnValue({
      isAdmin: true,
      searchValue: "",
      sortField: "name",
      sortOrder: "asc",
      filteredData: mockInitialLanguages,
      handleSort: jest.fn(),
      handleSearchChange: jest.fn(),
      resetSearch: jest.fn(),
      handleDelete: jest.fn(),
      isPending: false,
    });

    render(
      <LanguagesPageContent
        initialLanguages={mockInitialLanguages}
        isAdmin={true}
      />,
    );

    expect(screen.getByText("Languages")).toBeInTheDocument();

    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("EN")).toBeInTheDocument();
    expect(screen.getByText("English (Native)")).toBeInTheDocument();

    expect(screen.getByText("Russian")).toBeInTheDocument();
    expect(screen.getByText("RU")).toBeInTheDocument();
    expect(screen.getByText("Русский")).toBeInTheDocument();
  });

  it("renders empty state (DashBoardNoResults) when filtered data is empty", () => {
    (useTableLogic as jest.Mock).mockReturnValue({
      isAdmin: true,
      searchValue: "UnknownLanguage",
      sortField: "name",
      sortOrder: "asc",
      filteredData: [],
      handleSort: jest.fn(),
      handleSearchChange: jest.fn(),
      resetSearch: jest.fn(),
      handleDelete: jest.fn(),
      isPending: false,
    });

    render(
      <LanguagesPageContent
        initialLanguages={mockInitialLanguages}
        isAdmin={true}
      />,
    );

    expect(screen.queryByText("English")).not.toBeInTheDocument();

    expect(screen.getByText("No results found")).toBeInTheDocument();
    expect(screen.getByText("Try another search")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Reset Search/i }),
    ).toBeInTheDocument();
  });
});
