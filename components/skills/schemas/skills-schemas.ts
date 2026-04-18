import z from "zod";

export const getSkillsSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(2, t("validation.nameMin"))
      .max(50, t("validation.nameMax")),
    categoryId: z
      .string({ message: t("validation.categoryRequired") })
      .min(1, t("validation.categoryRequired")),
  });

export type SkillsSchemaValues = z.infer<ReturnType<typeof getSkillsSchema>>;