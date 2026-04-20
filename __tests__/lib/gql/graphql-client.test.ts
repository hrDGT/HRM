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

jest.mock("@/lib/auth/auth-service", () => ({
  refreshTokensAction: jest.fn(),
}));

jest.mock("@/lib/gql/gql-utils", () => ({
  isUnauthorizedError: jest.fn(),
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
      FRONTEND_URL: "http://localhost:3000"
    };

    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: "valid-token" }),
    });

    (isUnauthorizedError as jest.Mock).mockReturnValue(false);
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("gqlFetch (Base Client)", () => {
    it("throws an error if GRAPHQL_URL is missing", async () => {
      delete process.env.GRAPHQL_URL;
      await expect(gqlFetch(dummyDocument)).rejects.toThrow("GRAPHQL_URL is missing");
    });

    it("makes a successful request and returns data without touching cookies", async () => {
      const mockData = { user: { id: 1 } };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: jest.fn().mockResolvedValue(JSON.stringify({ data: mockData })),
      });

      const result = await gqlFetch(dummyDocument, { id: 1 }, { headers: { "X-Custom": "Header" } });

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/graphql",
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            "Origin": "http://localhost:3000",
            "X-Custom": "Header",
          }),
        })
      );
      expect(cookies).not.toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it("throws UNAUTHORIZED on HTTP 401 status", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: jest.fn().mockResolvedValue(""),
      });

      await expect(gqlFetch(dummyDocument)).rejects.toThrow("UNAUTHORIZED");
    });

    it("throws UNAUTHORIZED if GraphQL errors contain unauthenticated code", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: jest.fn().mockResolvedValue(JSON.stringify({ errors: [{ message: "Token expired" }] })),
      });
      (isUnauthorizedError as jest.Mock).mockReturnValue(true);

      await expect(gqlFetch(dummyDocument)).rejects.toThrow("UNAUTHORIZED");
    });

    it("throws a specific GraphQL error message if standard errors exist", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: jest.fn().mockResolvedValue(JSON.stringify({ errors: [{ message: "Invalid credentials" }] })),
      });
      (isUnauthorizedError as jest.Mock).mockReturnValue(false);

      await expect(gqlFetch(dummyDocument)).rejects.toThrow("Invalid credentials");
    });
  });

  describe("gqlRequestAuthed (Authenticated Client)", () => {
    it("injects token from cookies and returns data successfully", async () => {
      const mockData = { departments: [{ id: 1, name: "HR" }] };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: jest.fn().mockResolvedValue(JSON.stringify({ data: mockData })),
      });

      const result = await gqlRequestAuthed(dummyDocument);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/graphql",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer valid-token",
            Origin: "http://localhost:3000",
          }),
        })
      );
      expect(result).toEqual(mockData);
    });

    it("refreshes token and retries if the first request throws UNAUTHORIZED", async () => {
      const mockData = { success: true };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: jest.fn().mockResolvedValue(""),
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: jest.fn().mockResolvedValue(JSON.stringify({ data: mockData })),
      });

      (refreshTokensAction as jest.Mock).mockResolvedValue("new-refreshed-token");

      const result = await gqlRequestAuthed(dummyDocument);

      expect(refreshTokensAction).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledTimes(2);

      expect(mockFetch).toHaveBeenNthCalledWith(
        2,
        "https://api.example.com/graphql",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer new-refreshed-token",
            Origin: "http://localhost:3000",
          }),
        })
      );

      expect(result).toEqual(mockData);
    });

    it("throws 'Session expired' if token refresh fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: jest.fn().mockResolvedValue(""),
      });

      (refreshTokensAction as jest.Mock).mockResolvedValue(null);

      await expect(gqlRequestAuthed(dummyDocument)).rejects.toThrow("Session expired. Please login again.");

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("propagates standard GraphQL errors without refreshing", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: jest.fn().mockResolvedValue(JSON.stringify({ errors: [{ message: "Some other error" }] })),
      });

      await expect(gqlRequestAuthed(dummyDocument)).rejects.toThrow("Some other error");
      expect(refreshTokensAction).not.toHaveBeenCalled();
    });
  });
});