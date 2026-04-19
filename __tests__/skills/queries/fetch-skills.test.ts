import { cacheLife, cacheTag } from "next/cache";

import { fetchSkills, GET_SKILLS_QUERY } from '@/components/skills/queries/get-skills-query';
import { gqlRequestAuthed } from "@/lib/gql/graphql-client";

jest.mock("@/lib/gql/graphql-client", () => ({
  gqlRequestAuthed: jest.fn(),
}));

jest.mock("next/cache", () => ({
  cacheLife: jest.fn(),
  cacheTag: jest.fn(),
}));

describe("fetchSkills", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully fetch and return the list of skills", async () => {
    const mockSkills = [
      { id: "1", name: "First test skill" },
      { id: "2", name: "Second test skill" },
    ];

    (gqlRequestAuthed as jest.Mock).mockResolvedValueOnce({
      skills: mockSkills,
    });

    const token = "valid-mock-token";
    const result = await fetchSkills(token);

    expect(result).toEqual(mockSkills);

    expect(gqlRequestAuthed).toHaveBeenCalledWith(
      GET_SKILLS_QUERY,
      undefined,
      { token }
    );

    expect(cacheLife).toHaveBeenCalledWith("hours");
    expect(cacheTag).toHaveBeenCalledWith("skills");
  });

  it("should correctly make a request without a token if it is not provided", async () => {
    (gqlRequestAuthed as jest.Mock).mockResolvedValueOnce({
      skills: [],
    });

    await fetchSkills();

    expect(gqlRequestAuthed).toHaveBeenCalledWith(
      GET_SKILLS_QUERY,
      undefined,
      { token: undefined }
    );
  });

  it("should throw an error if the backend request fails", async () => {
    const mockError = new Error("GraphQL Network Error");
    (gqlRequestAuthed as jest.Mock).mockRejectedValueOnce(mockError);

    await expect(fetchSkills("some-token")).rejects.toThrow("GraphQL Network Error");

    expect(cacheLife).toHaveBeenCalled();
    expect(cacheTag).toHaveBeenCalled();
  });
});