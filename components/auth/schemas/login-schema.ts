import z from "zod"

export const loginSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string()
    .min(1, "Password is required")
    .min(5, "Password must be at least 5 characters long")
})


export type LoginFormValues = z.infer<typeof loginSchema>