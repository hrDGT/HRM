import { cookies } from "next/headers";

import { setAuthCookies } from "@/lib/auth/auth-cookies";

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

describe("setAuthCookies Utility", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sets access_token, refresh_token, and user_id with the correct security options and maxAge", async () => {
    const mockSet = jest.fn();

    (cookies as jest.Mock).mockResolvedValue({
      set: mockSet,
    });

    await setAuthCookies("fake-access-token", "fake-refresh-token", "fake-userId");

    expect(cookies).toHaveBeenCalledTimes(1);
    expect(mockSet).toHaveBeenCalledTimes(3);

    const expectedOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    };

    expect(mockSet).toHaveBeenNthCalledWith(1, "access_token", "fake-access-token", {
      ...expectedOptions,
      maxAge: 60 * 60 * 24 * 7,
    });

    expect(mockSet).toHaveBeenNthCalledWith(2, "refresh_token", "fake-refresh-token", {
      ...expectedOptions,
      maxAge: 60 * 60 * 24 * 30,
    });

    expect(mockSet).toHaveBeenNthCalledWith(3, "user_id", "fake-userId", {
      ...expectedOptions,
      maxAge: 60 * 60 * 24 * 30,
    });
  });
});