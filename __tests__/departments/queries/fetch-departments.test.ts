import { cacheLife, cacheTag } from "next/cache";

import { fetchDepartments, GET_DEPARTMENTS_QUERY } from "@/components/departments/queries/get-departments-query";
import { gqlRequestAuthed } from "@/lib/gql/graphql-client";

jest.mock("@/lib/gql/graphql-client", () => ({
  gqlRequestAuthed: jest.fn(),
}));

jest.mock("next/cache", () => ({
  cacheLife: jest.fn(),
  cacheTag: jest.fn(),
}));

describe("fetchDepartments", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully fetch and return the list of departments", async () => {
    const mockDepartments = [
      { id: "1", name: "First test dep" },
      { id: "2", name: "Second test dep" },
    ];

    (gqlRequestAuthed as jest.Mock).mockResolvedValueOnce({
      departments: mockDepartments,
    });

    const token = "valid-mock-token";
    const result = await fetchDepartments(token);

    expect(result).toEqual(mockDepartments);

    expect(gqlRequestAuthed).toHaveBeenCalledWith(
      GET_DEPARTMENTS_QUERY,
      undefined,
      { token }
    );

    expect(cacheLife).toHaveBeenCalledWith("hours");
    expect(cacheTag).toHaveBeenCalledWith("departments");
  });

  it("should correctly make a request without a token if it is not provided", async () => {
    (gqlRequestAuthed as jest.Mock).mockResolvedValueOnce({
      departments: [],
    });

    await fetchDepartments();

    expect(gqlRequestAuthed).toHaveBeenCalledWith(
      GET_DEPARTMENTS_QUERY,
      undefined,
      { token: undefined }
    );
  });

  it("should throw an error if the backend request fails", async () => {
    const mockError = new Error("GraphQL Network Error");
    (gqlRequestAuthed as jest.Mock).mockRejectedValueOnce(mockError);

    await expect(fetchDepartments("some-token")).rejects.toThrow("GraphQL Network Error");

    expect(cacheLife).toHaveBeenCalled();
    expect(cacheTag).toHaveBeenCalled();
  });
});