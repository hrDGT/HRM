import { cookies } from "next/headers";
import { setAuthCookies } from "@/lib/auth/auth-cookies";

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

describe("setAuthCookies Utility", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sets access_token and refresh_token with the correct security options and maxAge", async () => {
    const mockSet = jest.fn();

    (cookies as jest.Mock).mockResolvedValue({
      set: mockSet,
    });

    await setAuthCookies("fake-access-token", "fake-refresh-token");

    expect(cookies).toHaveBeenCalledTimes(1);

    expect(mockSet).toHaveBeenCalledTimes(2);

    expect(mockSet).toHaveBeenNthCalledWith(1, "access_token", "fake-access-token", {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    expect(mockSet).toHaveBeenNthCalledWith(2, "refresh_token", "fake-refresh-token", {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });
  });
});