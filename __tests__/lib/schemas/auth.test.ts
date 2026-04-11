import { forgotPasswordSchema } from "@/components/auth/schemas/forgot-password-schema";
import { loginSchema } from "@/components/auth/schemas/login-schema";
import { resetPasswordSchema } from "@/components/auth/schemas/reset-password-schema";
import { signupSchema } from "@/components/auth/schemas/signup-schema";


describe("Zod Auth Schemas", () => {

  describe("emailField validation", () => {
    it("throws a custom 'Invalid email' error for invalid formats", () => {
      const result = forgotPasswordSchema.safeParse({ email: "not-an-email" });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Invalid email");
      }
    });
  });

  describe("passwordField validation", () => {
    it("throws a 'Password is required' error when password is empty", () => {
      const result = loginSchema.safeParse({ email: 'validemail@gmail.com', password: '' })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password is required')
      }
    })

    it("throws an error if the password is shorter than 5 characters", () => {
      const result = loginSchema.safeParse({ email: 'validemail@gmail.com', password: '123' })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must be at least 5 characters long')
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
    });
  });
})