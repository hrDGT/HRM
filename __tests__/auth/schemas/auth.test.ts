import { getForgotPasswordSchema } from "@/components/auth/schemas/forgot-password-schema";
import { getLoginSchema } from "@/components/auth/schemas/login-schema";
import { getResetPasswordSchema } from "@/components/auth/schemas/reset-password-schema";
import { getSignupSchema } from "@/components/auth/schemas/signup-schema";

describe("Zod Auth Schemas", () => {
  const t = (key: string) => key;

  const forgotPasswordSchema = getForgotPasswordSchema(t);
  const loginSchema = getLoginSchema(t);
  const signupSchema = getSignupSchema(t);
  const resetPasswordSchema = getResetPasswordSchema(t);

  describe("emailField validation", () => {
    it("throws a custom 'invalidEmail' error for invalid formats", () => {
      const result = forgotPasswordSchema.safeParse({ email: "not-an-email" });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("invalidEmail");
      }
    });
  });

  describe("passwordField validation", () => {
    it("throws a 'passwordRequired' error when password is empty", () => {
      const result = loginSchema.safeParse({ email: 'validemail@gmail.com', password: '' })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('passwordRequired')
      }
    })

    it("throws an error if the password is shorter than 5 characters", () => {
      const result = loginSchema.safeParse({ email: 'validemail@gmail.com', password: '123' })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('passwordMinLength')
      }
    })
  })

  describe("loginSchema & signupSchema", () => {
    it("successfully parses valid data", () => {
      const validData = { email: 'validemail@gmail.com', password: 'correctPassword' }

      expect(loginSchema.safeParse(validData).success).toBe(true)
      expect(signupSchema.safeParse(validData).success).toBe(true)
    })
  })

  describe("forgotPasswordSchema", () => {
    it("successfully parses when only a valid email is provided", () => {
      expect(forgotPasswordSchema.safeParse({ email: "test@example.com" }).success).toBe(true);
    });
  });

  describe("resetPasswordSchema", () => {
    it("expects the newPassword field and validates its length", () => {
      const validData = { newPassword: "SecurePassword123" };
      const invalidData = { newPassword: "123" };

      expect(resetPasswordSchema.safeParse(validData).success).toBe(true);
      expect(resetPasswordSchema.safeParse(invalidData).success).toBe(false);

      if (!resetPasswordSchema.safeParse(invalidData).success) {
        const result = resetPasswordSchema.safeParse(invalidData);
        expect(result.error!.issues[0].message).toBe('passwordMinLength');
      }
    });
  });
})