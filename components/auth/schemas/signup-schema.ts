import z from "zod";

export const getSignupSchema = (t: (arg: string) => string) => z.object({
  email: z.email(t("invalidEmail")),
  password: z
    .string()
    .min(1, t("passwordRequired"))
    .min(5, t("passwordMinLength"))
});

export type SignupFormValues = z.infer<ReturnType<typeof getSignupSchema>>;