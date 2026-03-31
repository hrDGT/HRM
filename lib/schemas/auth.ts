import * as z from "zod"

export const signupSchema = z.object({
  email: z
    .email("Email is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(5, "At least 5 characters"),
})

export type SignupFormValues = z.infer<typeof signupSchema>