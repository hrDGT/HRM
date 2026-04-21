import z from "zod";

export const getLanguagesSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(2, t("validation.nameMin"))
      .max(20, t("validation.nameMax"))
      .regex(/^[а-яА-ЯёЁa-zA-Z]+$/, t("validation.onlyLetters")),
    native_name: z
      .string()
      .max(20, t("validation.nameMax"))
      .regex(/^[а-яА-ЯёЁa-zA-Z\s\-]+$/, t("validation.onlyLetters"))
      .optional()
      .or(z.literal("")),
    iso2: z
      .string()
      .length(2, t("validation.isoLength"))
      .regex(/^[а-яА-ЯёЁa-zA-Z]+$/, t("validation.onlyLetters"))
  });

export type LanguagesSchemaValues = z.infer<ReturnType<typeof getLanguagesSchema>>;