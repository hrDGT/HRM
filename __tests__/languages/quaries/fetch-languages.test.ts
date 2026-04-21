import { cacheLife, cacheTag } from "next/cache";

import { fetchLanguages, GET_LANGUAGES_QUERY } from "@/components/languages/queries/get-languages-query";
import { gqlRequestAuthed } from "@/lib/gql/graphql-client";

jest.mock("@/lib/gql/graphql-client", () => ({
  gqlRequestAuthed: jest.fn(),
}));

jest.mock("next/cache", () => ({
  cacheLife: jest.fn(),
  cacheTag: jest.fn(),
}));

describe("fetchLanguages", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully fetch and return the list of languages", async () => {
    const mockLanguages = [
      { id: "1", name: "English", iso2: "en", native_name: "English" },
      { id: "2", name: "Russian", iso2: "ru", native_name: "Русский" },
    ];

    (gqlRequestAuthed as jest.Mock).mockResolvedValueOnce({
      languages: mockLanguages,
    });

    const token = "valid-mock-token";
    const result = await fetchLanguages(token);

    expect(result).toEqual(mockLanguages);

    expect(gqlRequestAuthed).toHaveBeenCalledWith(
      GET_LANGUAGES_QUERY,
      undefined,
      { token }
    );

    expect(cacheLife).toHaveBeenCalledWith("hours");
    expect(cacheTag).toHaveBeenCalledWith("languages");
  });

  it("should correctly make a request without a token if it is not provided", async () => {
    (gqlRequestAuthed as jest.Mock).mockResolvedValueOnce({
      languages: [],
    });

    await fetchLanguages();

    expect(gqlRequestAuthed).toHaveBeenCalledWith(
      GET_LANGUAGES_QUERY,
      undefined,
      { token: undefined }
    );
  });

  it("should throw an error if the backend request fails", async () => {
    const mockError = new Error("GraphQL Network Error");
    (gqlRequestAuthed as jest.Mock).mockRejectedValueOnce(mockError);

    await expect(fetchLanguages("some-token")).rejects.toThrow("GraphQL Network Error");

    expect(cacheLife).toHaveBeenCalled();
    expect(cacheTag).toHaveBeenCalled();
  });
});