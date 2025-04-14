import { cookies } from "next/headers";
import { TypedDocumentNode } from "@graphql-typed-document-node/core";

import { isUnauthorizedError } from "@/lib/gql/gql-utils";
import { gqlRequest } from "@/lib/gql/graphql-client";

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

jest.mock("graphql", () => ({
  print: jest.fn(() => "MOCKED_GRAPHQL_QUERY"),
}));

jest.mock("@/lib/gql/gql-utils", () => ({
  isUnauthorizedError: jest.fn(),
}));

global.fetch = jest.fn();

describe("gqlRequest Utility", () => {
  const originalEnv = process.env;

  const dummyDocument = {} as TypedDocumentNode<unknown, unknown>;

  beforeEach(() => {
    jest.clearAllMocks();

    process.env = { ...originalEnv, GRAPHQL_URL: "https://api.example.com/graphql" };

    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn((name: string) => {
        if (name === "access_token") return { value: "valid-token" };
        return undefined;
      }),
      getAll: jest.fn().mockReturnValue([
        { name: "access_token", value: "valid-token" },
      ]),
    });

    (isUnauthorizedError as jest.Mock).mockReturnValue(false);
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("throws an error if GRAPHQL_URL is missing", async () => {
    delete process.env.GRAPHQL_URL;

    await expect(gqlRequest(dummyDocument)).rejects.toThrow("GRAPHQL_URL is missing");
  });

  it("makes a successful request and returns data", async () => {
    const mockData = { user: { id: 1, name: "John Doe" } };

    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({ data: mockData }),
    });

    const result = await gqlRequest(dummyDocument, { id: 1 }, { "X-Custom": "Header" });

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.example.com/graphql",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer valid-token",
          "X-Custom": "Header",
        },
        body: JSON.stringify({ query: "MOCKED_GRAPHQL_QUERY", variables: { id: 1 } }),
      })
    );

    expect(result).toEqual(mockData);
  });

  it("throws an error if the GraphQL response contains standard errors", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        errors: [{ message: "Some GraphQL Error" }],
      }),
    });

    (isUnauthorizedError as jest.Mock).mockReturnValue(false);

    await expect(gqlRequest(dummyDocument)).rejects.toThrow("Some GraphQL Error");
  });

  it("refreshes the token and retries the request when an unauthorized error occurs", async () => {
    const mockData = { success: true };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ errors: [{ message: "Unauthorized" }] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ access_token: "new-refreshed-token" }),
      })
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ data: mockData }),
      });

    (isUnauthorizedError as jest.Mock).mockReturnValue(true);

    const result = await gqlRequest(dummyDocument);

    expect(global.fetch).toHaveBeenCalledTimes(3);

    expect(global.fetch).toHaveBeenNthCalledWith(
      3,
      "https://api.example.com/graphql",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer new-refreshed-token",
        }),
      })
    );

    expect(result).toEqual(mockData);
  });

  it("throws a session expired error if token refresh fails", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ errors: [{ message: "Unauthorized" }] }),
      })
      .mockResolvedValueOnce({
        ok: false,
      });

    (isUnauthorizedError as jest.Mock).mockReturnValue(true);

    await expect(gqlRequest(dummyDocument)).rejects.toThrow("Session expired. Please login again.");

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
