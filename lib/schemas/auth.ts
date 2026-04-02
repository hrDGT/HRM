import * as z from "zod"

const emailField = z.email('Invalid email')

const passwordField = z
  .string()
  .min(1, "Password is required")
  .min(5, "Password must be at least 5 characters long");

export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
})

export const signupSchema = z.object({
  email: emailField,
  password: passwordField,
})

export const forgotPasswordSchema = z.object({
  email: emailField
})

export const resetPasswordSchema = z.object({
  newPassword: passwordField,
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type SignupFormValues = z.infer<typeof signupSchema>
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordValue = z.infer<typeof resetPasswordSchema>