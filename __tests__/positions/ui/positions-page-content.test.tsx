"use client";

import { render, screen } from "@testing-library/react";

import { useTableLogic } from "@/components/dashboard/hooks/use-table-logic";
import { PositionsPageContent } from "@/components/positions/ui/positions-page-content";

jest.mock("@/components/dashboard/hooks/use-table-logic");

jest.mock("next-intl", () => ({
  useTranslations: jest.fn((namespace) => (key: string) => {
    const messages: Record<string, string> = {
      title: "Positions",
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

jest.mock("@/components/positions/actions/delete-positions-action", () => ({
  deletePositionAction: jest.fn(),
}));

jest.mock("@/components/positions/actions/create-positions-action", () => ({
  createPositionAction: jest.fn(),
}));

jest.mock("@/components/positions/actions/update-positions-action", () => ({
  updatePositionAction: jest.fn(),
}));

describe("PositionsPageContent", () => {
  const mockInitialPositions = [
    { id: "1", name: "First test pos" },
    { id: "2", name: "Second test pos" },
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
      filteredData: mockInitialPositions,
      handleSort: jest.fn(),
      handleSearchChange: jest.fn(),
      resetSearch: jest.fn(),
      handleDelete: jest.fn(),
      isPending: false,
    });

    render(
      <PositionsPageContent
        initialPositions={mockInitialPositions}
        isAdmin={true}
      />,
    );

    expect(screen.getByText("Positions")).toBeInTheDocument();
    expect(screen.getByText("First test pos")).toBeInTheDocument();
    expect(screen.getByText("Second test pos")).toBeInTheDocument();
  });

  it("renders empty state (DashBoardNoResults) when filtered data is empty", () => {
    (useTableLogic as jest.Mock).mockReturnValue({
      isAdmin: true,
      searchValue: "UnknownPos",
      sortField: "name",
      sortOrder: "asc",
      filteredData: [], // <-- ИЗМЕНЕНО
      handleSort: jest.fn(),
      handleSearchChange: jest.fn(),
      resetSearch: jest.fn(),
      handleDelete: jest.fn(),
      isPending: false,
    });

    render(
      <PositionsPageContent
        initialPositions={mockInitialPositions}
        isAdmin={true}
      />,
    );

    expect(screen.queryByText("First test pos")).not.toBeInTheDocument();

    expect(screen.getByText("No results found")).toBeInTheDocument();
    expect(screen.getByText("Try another search")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Reset Search/i }),
    ).toBeInTheDocument();
  });
});
