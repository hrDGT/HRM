"use client";

import { render, screen } from "@testing-library/react";

import { useTableLogic } from "@/components/dashboard/hooks/use-table-logic";
import { SkillsPageContent } from "@/components/skills/ui/skills-page-content";

jest.mock("@/components/dashboard/hooks/use-table-logic");

jest.mock("next-intl", () => ({
  useTranslations: jest.fn((namespace) => (key: string) => {
    const messages: Record<string, string> = {
      title: "Skills",
      "fields.name": "Name",
      "fields.category": "Category",
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

jest.mock("@/components/skills/actions/delete-skills-action", () => ({
  deleteSkillAction: jest.fn(),
}));

jest.mock("@/components/skills/actions/create-skills-action", () => ({
  createSkillAction: jest.fn(),
}));

jest.mock("@/components/skills/actions/update-skills-action", () => ({
  updateSkillAction: jest.fn(),
}));

describe("SkillsPageContent", () => {
  const mockInitialSkills = [
    { id: "1", name: "React", category: { id: "c1", name: "Frontend" } },
    { id: "2", name: "Node.js", category: { id: "c2", name: "Backend" } },
  ];

  const mockSkillsCategories = [
    { id: "c1", name: "Frontend", order: 1 },
    { id: "c2", name: "Backend", order: 2 },
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
      filteredData: mockInitialSkills,
      handleSort: jest.fn(),
      handleSearchChange: jest.fn(),
      resetSearch: jest.fn(),
      handleDelete: jest.fn(),
      isPending: false,
    });

    render(
      <SkillsPageContent
        initialSkills={mockInitialSkills}
        skillsCategories={mockSkillsCategories}
        isAdmin={true}
      />,
    );

    expect(screen.getByText("Skills")).toBeInTheDocument();

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();

    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
  });

  it("renders empty state (DashBoardNoResults) when filtered data is empty", () => {
    (useTableLogic as jest.Mock).mockReturnValue({
      isAdmin: true,
      searchValue: "UnknownSkill",
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
      <SkillsPageContent
        initialSkills={mockInitialSkills}
        skillsCategories={mockSkillsCategories}
        isAdmin={true}
      />,
    );

    expect(screen.queryByText("React")).not.toBeInTheDocument();

    expect(screen.getByText("No results found")).toBeInTheDocument();
    expect(screen.getByText("Try another search")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Reset Search/i }),
    ).toBeInTheDocument();
  });
});
