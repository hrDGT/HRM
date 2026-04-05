import { refreshTokensAction } from "@/lib/auth/auth-service";
import { cookies } from "next/headers";
import { setAuthCookies } from "@/lib/auth/auth-cookies";

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

jest.mock("@/lib/auth/auth-cookies", () => ({
  setAuthCookies: jest.fn(),
}));

jest.mock("graphql", () => ({
  print: jest.fn(() => "MOCKED_MUTATION_STRING"),
}));

jest.mock("@/gqlcodegen", () => ({
  graphql: jest.fn((query) => query),
}));

global.fetch = jest.fn();

describe("refreshTokensAction", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();

    process.env = { ...originalEnv, GRAPHQL_URL: "https://api.example.com/graphql" };

    jest.spyOn(console, "error").mockImplementation(() => { });
  });

  afterAll(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  it("returns null if there is no refresh_token in cookies", async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue(undefined),
    });

    const result = await refreshTokensAction();

    expect(result).toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("successfully fetches new tokens, sets cookies, and returns the new access_token", async () => {
    const mockRefreshToken = "old-refresh-token";
    const newAccessToken = "new-access-token";
    const newRefreshToken = "new-refresh-token";

    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: mockRefreshToken }),
    });

    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        data: {
          updateToken: {
            access_token: newAccessToken,
            refresh_token: newRefreshToken,
          },
        },
      }),
    });

    const result = await refreshTokensAction();

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.example.com/graphql",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockRefreshToken}`,
          Cookie: `refresh_token=${mockRefreshToken}`,
        },
        body: JSON.stringify({ query: "MOCKED_MUTATION_STRING" }),
      })
    );

    expect(setAuthCookies).toHaveBeenCalledWith(newAccessToken, newRefreshToken);

    expect(result).toBe(newAccessToken);
  });

  it("returns null if the GraphQL response does not contain updateToken data", async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: "valid-token" }),
    });

    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        data: null,
      }),
    });

    const result = await refreshTokensAction();

    expect(result).toBeNull();
    expect(setAuthCookies).not.toHaveBeenCalled();
  });

  it("catches errors, logs them, and returns null on fetch failure", async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: "valid-token" }),
    });

    const mockError = new Error("Network failure");
    (global.fetch as jest.Mock).mockRejectedValue(mockError);

    const result = await refreshTokensAction();

    expect(console.error).toHaveBeenCalledWith("Refresh error:", mockError);
    expect(result).toBeNull();
    expect(setAuthCookies).not.toHaveBeenCalled();
  });
});