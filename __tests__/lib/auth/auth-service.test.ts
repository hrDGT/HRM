import { cookies } from "next/headers";
import { setAuthCookies } from "@/lib/auth/auth-cookies";
import { refreshTokensAction } from "@/lib/auth/auth-service";

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

jest.mock("@/lib/auth/auth-cookies", () => ({
  setAuthCookies: jest.fn(),
}));

jest.mock("graphql", () => ({
  print: jest.fn(() => "MOCKED_QUERY"),
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

    (setAuthCookies as jest.Mock).mockResolvedValue(undefined);
  });

  afterAll(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  it("successfully fetches new tokens and returns the new access_token", async () => {
    const mockRefreshToken = "old-refresh-token";
    const newAccessToken = "new-access-token";
    const newRefreshToken = "new-refresh-token";

    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: mockRefreshToken }),
    });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
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

    if (result === null) {
      const errors = (console.error as jest.Mock).mock.calls;
      if (errors.length > 0) {
        console.log("REAL ERROR INSIDE ACTION:", errors[0]);
      }
    }

    expect(result).toBe(newAccessToken);
    expect(setAuthCookies).toHaveBeenCalledWith(newAccessToken, newRefreshToken);
  });

  it("returns null if there is no refresh_token in cookies", async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue(undefined),
    });

    const result = await refreshTokensAction();

    expect(result).toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("returns null if the GraphQL response does not contain updateToken data", async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: "valid-token" }),
    });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ data: null }),
    });

    const result = await refreshTokensAction();

    expect(result).toBeNull();
  });

  it("catches errors and returns null on fetch failure", async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: "valid-token" }),
    });

    const mockError = new Error("Network failure");
    (global.fetch as jest.Mock).mockRejectedValue(mockError);

    const result = await refreshTokensAction();

    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalledWith("Failed to fetch new tokens:", mockError);
  });
});