import { getSkillsSchema } from "@/components/skills/schemas/skills-schemas";

describe("Skills Zod Schema", () => {
  const t = (key: string) => {
    const messages: Record<string, string> = {
      "validation.nameMin": "Name must be at least 2 characters",
      "validation.nameMax": "Name is too long",
      "validation.categoryRequired": "Please select a category",
    };
    return messages[key] || key;
  };

  const skillsSchema = getSkillsSchema(t);

  it("successfully parses a valid skill (with name and categoryId)", () => {
    const result = skillsSchema.safeParse({ name: "React", categoryId: "c1" });
    expect(result.success).toBe(true);
  });

  it("fails if the name is too short (less than 2 characters)", () => {
    const result = skillsSchema.safeParse({ name: "A", categoryId: "c1" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Name must be at least 2 characters");
    }
  });

  it("fails if the name is too long (more than 50 characters)", () => {
    const longName = "A".repeat(51);
    const result = skillsSchema.safeParse({ name: longName, categoryId: "c1" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Name is too long");
    }
  });

  it("fails if the name is missing or empty", () => {
    const result = skillsSchema.safeParse({ name: "", categoryId: "c1" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Name must be at least 2 characters");
    }
  });

  it("fails if the categoryId is missing or empty", () => {
    const result = skillsSchema.safeParse({ name: "React", categoryId: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Please select a category");
    }
  });
});