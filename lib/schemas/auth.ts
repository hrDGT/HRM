import * as z from "zod"

export const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(5, "At least 5 characters"),
})

export const signupSchema = z.object({
  email: z
    .email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(5, "At least 5 characters"),
})

export const forgotPasswordSchema = z.object({
  email: z.email('Invalid email')
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type SignupFormValues = z.infer<typeof signupSchema>
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>