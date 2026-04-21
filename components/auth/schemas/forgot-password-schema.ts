import z from "zod";

export const getForgotPasswordSchema = (t: (arg: string) => string) =>
  z.object({
    email: z.email((t("invalidEmail")))
  });

export type ForgotPasswordFormValues = z.infer<ReturnType<typeof getForgotPasswordSchema>>;