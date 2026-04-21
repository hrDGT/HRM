import { cacheLife, cacheTag } from "next/cache";

import { fetchSkillsCategories, GET_SKILL_CATEGORIES_QUERY } from "@/components/skills/queries/get-skills-categories-query";
import { gqlRequestAuthed } from "@/lib/gql/graphql-client";

jest.mock("@/lib/gql/graphql-client", () => ({
  gqlRequestAuthed: jest.fn(),
}));

jest.mock("next/cache", () => ({
  cacheLife: jest.fn(),
  cacheTag: jest.fn(),
}));

describe("fetchSkillsCategories", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully fetch and return the list of skills categories", async () => {
    const mockSkillsCategories = [
      { id: "1", name: "First test skill category", order: 1 },
      { id: "2", name: "Second test skill category", order: 2 },
    ];

    (gqlRequestAuthed as jest.Mock).mockResolvedValueOnce({
      skillCategories: mockSkillsCategories
    });

    const token = "valid-mock-token";
    const result = await fetchSkillsCategories(token);

    expect(result).toEqual(mockSkillsCategories);

    expect(gqlRequestAuthed).toHaveBeenCalledWith(
      GET_SKILL_CATEGORIES_QUERY,
      undefined,
      { token }
    );

    expect(cacheLife).toHaveBeenCalledWith("hours");
    expect(cacheTag).toHaveBeenCalledWith("skill-categories");
  });

  it("should correctly make a request without a token if it is not provided", async () => {
    (gqlRequestAuthed as jest.Mock).mockResolvedValueOnce({
      skillCategories: []
    });

    await fetchSkillsCategories();

    expect(gqlRequestAuthed).toHaveBeenCalledWith(
      GET_SKILL_CATEGORIES_QUERY,
      undefined,
      { token: undefined }
    );
  });

  it("should throw an error if the backend request fails", async () => {
    const mockError = new Error("GraphQL Network Error");
    (gqlRequestAuthed as jest.Mock).mockRejectedValueOnce(mockError);

    await expect(fetchSkillsCategories("some-token")).rejects.toThrow("GraphQL Network Error");

    expect(cacheLife).toHaveBeenCalled();
    expect(cacheTag).toHaveBeenCalled();
  });
});