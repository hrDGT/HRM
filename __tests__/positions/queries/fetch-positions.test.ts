import { cacheLife, cacheTag } from "next/cache";

import { fetchPositions, GET_POSITIONS_QUERY } from "@/components/positions/queries/get-positions-query";
import { gqlRequestAuthed } from "@/lib/gql/graphql-client";

jest.mock("@/lib/gql/graphql-client", () => ({
  gqlRequestAuthed: jest.fn(),
}));

jest.mock("next/cache", () => ({
  cacheLife: jest.fn(),
  cacheTag: jest.fn(),
}));

describe("fetchPositions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully fetch and return the list of positions", async () => {
    const mockPositions = [
      { id: "1", name: "First test pos" },
      { id: "2", name: "Second test pos" },
    ];

    (gqlRequestAuthed as jest.Mock).mockResolvedValueOnce({
      positions: mockPositions,
    });

    const token = "valid-mock-token";
    const result = await fetchPositions(token);

    expect(result).toEqual(mockPositions);

    expect(gqlRequestAuthed).toHaveBeenCalledWith(
      GET_POSITIONS_QUERY,
      undefined,
      { token }
    );

    expect(cacheLife).toHaveBeenCalledWith("hours");
    expect(cacheTag).toHaveBeenCalledWith("positions");
  });

  it("should correctly make a request without a token if it is not provided", async () => {
    (gqlRequestAuthed as jest.Mock).mockResolvedValueOnce({
      positions: [],
    });

    await fetchPositions();

    expect(gqlRequestAuthed).toHaveBeenCalledWith(
      GET_POSITIONS_QUERY,
      undefined,
      { token: undefined }
    );
  });

  it("should throw an error if the backend request fails", async () => {
    const mockError = new Error("GraphQL Network Error");
    (gqlRequestAuthed as jest.Mock).mockRejectedValueOnce(mockError);

    await expect(fetchPositions("some-token")).rejects.toThrow("GraphQL Network Error");

    expect(cacheLife).toHaveBeenCalled();
    expect(cacheTag).toHaveBeenCalled();
  });
});