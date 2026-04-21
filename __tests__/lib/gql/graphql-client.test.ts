import { cookies } from "next/headers";
import { type TypedDocumentNode } from "@graphql-typed-document-node/core";

import { refreshTokensAction } from "@/lib/auth/auth-service";
import { isUnauthorizedError } from "@/lib/gql/gql-utils";
import { gqlFetch, gqlRequestAuthed } from "@/lib/gql/graphql-client";

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

jest.mock("graphql", () => ({
  print: jest.fn(() => "MOCKED_GRAPHQL_QUERY"),
}));

jest.mock("@/lib/gql/gql-utils", () => ({
  isUnauthorizedError: jest.fn(),
}));

jest.mock("@/lib/auth/auth-service", () => ({
  refreshTokensAction: jest.fn(),
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("GraphQL Client Utilities", () => {
  const originalEnv = process.env;
  const dummyDocument = {} as TypedDocumentNode<unknown, unknown>;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      GRAPHQL_URL: "https://api.example.com/graphql",
      PORT: "3000",
    };

    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn((name: string) => {
        if (name === "access_token") return { value: "valid-token" };
        return undefined;
      }),
      getAll: jest.fn().mockReturnValue([
        { name: "access_token", value: "valid-token" },
      ]),
    });
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("gqlFetch (Base Client)", () => {
    it("makes a successful request and returns data without touching cookies", async () => {
      const mockData = { user: { id: 1 } };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({ data: mockData }),
      });

      const result = await gqlFetch(dummyDocument, { id: 1 }, { headers: { "X-Custom": "Header" } });

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/graphql",
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            "X-Custom": "Header",
          }),
        })
      );
      expect(result).toEqual(mockData);
    });

    it("throws UNAUTHORIZED if GraphQL errors contain unauthenticated code", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({ errors: [{ message: "Unauthorized", extensions: { code: "UNAUTHENTICATED" } }] }),
      });

      await expect(gqlFetch(dummyDocument)).rejects.toThrow("Unauthorized");
    });
  });

  describe("gqlRequestAuthed (Authenticated Client)", () => {
    it("injects token from cookies and returns data successfully", async () => {
      const mockData = { departments: [{ id: 1, name: "HR" }] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({ data: mockData }),
      });

      const result = await gqlRequestAuthed(dummyDocument);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/graphql",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer valid-token",
          }),
        })
      );
      expect(result).toEqual(mockData);
    });

    it("throws 'Session expired' error if the request returns UNAUTHORIZED", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({
          errors: [{ message: "Unauthorized", extensions: { code: "UNAUTHENTICATED" } }]
        }),
      });

      (isUnauthorizedError as jest.Mock).mockReturnValueOnce(true);

      await expect(gqlRequestAuthed(dummyDocument)).rejects.toThrow(
        "Session expired. Please login again."
      );

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("throws 'Session expired' if token refresh fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ errors: [{ message: "Unauthorized", extensions: { code: "UNAUTHENTICATED" } }] }),
      });
      (isUnauthorizedError as jest.Mock).mockReturnValueOnce(true);

      (refreshTokensAction as jest.Mock).mockResolvedValueOnce(null);

      await expect(gqlRequestAuthed(dummyDocument)).rejects.toThrow("Session expired. Please login again.");

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});