"use client";

import { render, screen } from "@testing-library/react";

import { useTableLogic } from "@/components/dashboard/hooks/use-table-logic";
import { DepartmentsPageContent } from "@/components/departments/ui/departments-page-content";

jest.mock("@/components/dashboard/hooks/use-table-logic");

jest.mock("next-intl", () => ({
  useTranslations: jest.fn((namespace) => (key: string) => {
    const messages: Record<string, string> = {
      title: "Departments",
      "fields.name": "Name",
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

jest.mock("@/components/departments/actions/delete-departments-action", () => ({
  deleteDepartmentAction: jest.fn(),
}));

jest.mock("@/components/departments/actions/create-departments-action", () => ({
  createDepartmentAction: jest.fn(),
}));

jest.mock("@/components/departments/actions/update-departments-action", () => ({
  updateDepartmentAction: jest.fn(),
}));

describe("DepartmentsPageContent", () => {
  const mockInitialDepartments = [
    { id: "1", name: "First test dep" },
    { id: "2", name: "Second test dep" },
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
      filteredData: mockInitialDepartments,
      handleSort: jest.fn(),
      handleSearchChange: jest.fn(),
      resetSearch: jest.fn(),
      handleDelete: jest.fn(),
      isPending: false,
    });

    render(
      <DepartmentsPageContent
        initialDepartments={mockInitialDepartments}
        isAdmin={true}
      />,
    );

    expect(screen.getByText("Departments")).toBeInTheDocument();
    expect(screen.getByText("First test dep")).toBeInTheDocument();
    expect(screen.getByText("Second test dep")).toBeInTheDocument();
  });

  it("renders empty state (DashBoardNoResults) when filtered data is empty", () => {
    (useTableLogic as jest.Mock).mockReturnValue({
      isAdmin: true,
      searchValue: "UnknownDept",
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
      <DepartmentsPageContent
        initialDepartments={mockInitialDepartments}
        isAdmin={true}
      />,
    );

    expect(screen.queryByText("First test dep")).not.toBeInTheDocument();

    expect(screen.getByText("No results found")).toBeInTheDocument();
    expect(screen.getByText("Try another search")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Reset Search/i }),
    ).toBeInTheDocument();
  });
});
