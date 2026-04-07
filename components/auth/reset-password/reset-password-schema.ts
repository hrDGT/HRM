import z from "zod"

export const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(1, "Password is required")
    .min(5, "Password must be at least 5 characters long")
})

export type ResetPasswordValue = z.infer<typeof resetPasswordSchema>