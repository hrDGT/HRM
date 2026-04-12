import z from "zod";

export const departmentsSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long")
});

export type DepartmentsSchemaValues = z.infer<typeof departmentsSchema>