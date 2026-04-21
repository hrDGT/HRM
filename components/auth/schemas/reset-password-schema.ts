import z from "zod";

export const getResetPasswordSchema = (t: (arg: string) => string) =>
  z.object({
    newPassword: z.string()
      .min(1, t("passwordRequired"))
      .min(5, t("passwordMinLength"))
  });

export type ResetPasswordFormValues = z.infer<ReturnType<typeof getResetPasswordSchema>>;