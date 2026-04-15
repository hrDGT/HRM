import z from "zod";

export const getPositionsSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(2, t("validation.nameMin"))
      .max(50, t("validation.nameMax"))
  });

export type PositionsSchemaValues = z.infer<ReturnType<typeof getPositionsSchema>>;