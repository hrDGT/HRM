import z from "zod"

export const signupSchema = z.object({
  email: z.email('Invalid email'),
  password: z
    .string()
    .min(1, "Password is required")
    .min(5, "Password must be at least 5 characters long")
})

export type SignupFormValues = z.infer<typeof signupSchema>
