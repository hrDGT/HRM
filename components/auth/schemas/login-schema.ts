import z from "zod";

export const getLoginSchema = (t: (arg: string) => string) =>
  z.object({
    email: z.email(t("invalidEmail")),
    password: z.string()
      .min(1, t("passwordRequired"))
      .min(5, t("passwordMinLength"))
  });

export type LoginFormValues = z.infer<ReturnType<typeof getLoginSchema>>;