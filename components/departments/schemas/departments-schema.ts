import z from "zod";

export const getDepartmentsSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(2, t("validation.nameMin"))
      .max(50, t("validation.nameMax"))
  });

export type DepartmentsSchemaValues = z.infer<ReturnType<typeof getDepartmentsSchema>>;