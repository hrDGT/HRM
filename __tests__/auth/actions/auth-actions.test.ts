import { redirect } from "next/navigation";

import { forgotPasswordAction } from "@/components/auth/actions/forgot-password-action";
import { loginUserAction } from "@/components/auth/actions/login-action";
import { resetPasswordAction } from "@/components/auth/actions/reset-password-action";
import { signUpUserAction } from "@/components/auth/actions/signup-action";
import { setAuthCookies } from "@/lib/auth/auth-cookies";
import { gqlFetch } from "@/lib/gql/graphql-client";

jest.mock("next-intl/server", () => ({
  getTranslations: jest.fn(() => Promise.resolve((key: string) => key)),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("@/lib/gql/graphql-client", () => ({
  gqlFetch: jest.fn(),
}));

jest.mock("@/lib/auth/auth-cookies", () => ({
  setAuthCookies: jest.fn(),
}));

jest.mock("@/gqlcodegen", () => ({
  graphql: jest.fn((query) => query),
}));

describe("Auth Server Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("signUpUserAction", () => {
    const mockSignupData = { email: "test@example.com", password: "Password123!" };

    it("successfully signs up, sets cookies, and redirects", async () => {
      (gqlFetch as jest.Mock).mockResolvedValue({
        signup: {
          user: { id: "user-123" },
          access_token: "access-123",
          refresh_token: "refresh-123"
        },
      });

      const response = await signUpUserAction(null, mockSignupData);

      expect(gqlFetch).toHaveBeenCalledTimes(1);
      expect(setAuthCookies).toHaveBeenCalledWith("access-123", "refresh-123", "user-123");
      expect(redirect).toHaveBeenCalledWith("/");

      expect(response).toBeUndefined();
    });

    it("returns an error if signup fails", async () => {
      (gqlFetch as jest.Mock).mockRejectedValue(new Error("Email already exists"));

      const response = await signUpUserAction(null, mockSignupData);

      expect(response).toEqual({ error: "Email already exists" });
      expect(setAuthCookies).not.toHaveBeenCalled();
      expect(redirect).not.toHaveBeenCalled();
    });

    it("returns fallback error message if error is not an Error instance", async () => {
      (gqlFetch as jest.Mock).mockRejectedValue("String error, not Error object");

      const response = await signUpUserAction(null, mockSignupData);

      expect(response).toEqual({ error: "error" });
    });
  });

  describe("loginUserAction", () => {
    const mockLoginData = { email: "test@example.com", password: "Password123!" };

    it("successfully logs in, sets cookies, and redirects", async () => {
      (gqlFetch as jest.Mock).mockResolvedValue({
        login: {
          user: { id: "1", email: "test@example.com" },
          access_token: "acc-token",
          refresh_token: "ref-token"
        },
      });

      await loginUserAction(null, mockLoginData);

      expect(gqlFetch).toHaveBeenCalledTimes(1);
      expect(setAuthCookies).toHaveBeenCalledWith("acc-token", "ref-token", "1");
      expect(redirect).toHaveBeenCalledWith("/");
    });

    it("returns an error if login fails", async () => {
      (gqlFetch as jest.Mock).mockRejectedValue(new Error("Invalid credentials"));

      const response = await loginUserAction(null, mockLoginData);

      expect(response).toEqual({ error: "Invalid credentials" });
      expect(redirect).not.toHaveBeenCalled();
    });
  });

  describe("forgotPasswordAction", () => {
    const mockData = { email: "test@example.com" };

    it("returns success: true on successful request", async () => {
      (gqlFetch as jest.Mock).mockResolvedValue({ forgotPassword: true });

      const response = await forgotPasswordAction(null, mockData);

      expect(gqlFetch).toHaveBeenCalledTimes(1);
      expect(response).toEqual({ success: true });
    });

    it("returns an error if request fails", async () => {
      (gqlFetch as jest.Mock).mockRejectedValue(new Error("User not found"));

      const response = await forgotPasswordAction(null, mockData);

      expect(response).toEqual({ error: "User not found" });
    });
  });

  describe("resetPasswordAction", () => {
    const mockData = { newPassword: "NewPassword123!" };

    it("returns an error if token is missing", async () => {
      const response = await resetPasswordAction("", null, mockData);

      expect(response).toEqual({ error: "tokenError" });
      expect(gqlFetch).not.toHaveBeenCalled();
    });

    it("successfully resets password using the token in Authorization header", async () => {
      (gqlFetch as jest.Mock).mockResolvedValue({ resetPassword: true });

      const response = await resetPasswordAction("valid-reset-token", null, mockData);

      expect(gqlFetch).toHaveBeenCalledWith(
        expect.anything(),
        { auth: mockData },
        { headers: { Authorization: "Bearer valid-reset-token" } }
      );
      expect(response).toEqual({ success: true });
    });

    it("returns an error if reset mutation fails", async () => {
      (gqlFetch as jest.Mock).mockRejectedValue(new Error("Token expired"));

      const response = await resetPasswordAction("expired-token", null, mockData);

      expect(response).toEqual({ error: "Token expired" });
    });
  });
});