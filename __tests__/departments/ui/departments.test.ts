import { departmentsSchema } from "@/components/departments/schemas/departments-schema";

describe("Departments Zod Schema", () => {
  it("successfully parses a valid department name", () => {
    const result = departmentsSchema.safeParse({ name: "Human Resources" });
    expect(result.success).toBe(true);
  });

  it("fails if the name is too short (less than 2 characters)", () => {
    const result = departmentsSchema.safeParse({ name: "A" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Name must be at least 2 characters");
    }
  });

  it("fails if the name is too long (more than 50 characters)", () => {
    const longName = "A".repeat(51);
    const result = departmentsSchema.safeParse({ name: longName });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Name is too long");
    }
  });

  it("fails if the name is missing or empty", () => {
    const result = departmentsSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });
});