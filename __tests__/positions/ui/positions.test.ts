import { getPositionsSchema } from "@/components/positions/schemas/positions-schema";

describe("Positions Zod Schema", () => {
  const t = (key: string) => {
    const messages: Record<string, string> = {
      "validation.nameMin": "Name must be at least 2 characters",
      "validation.nameMax": "Name is too long",
    };
    return messages[key] || key;
  };

  const positionSchema = getPositionsSchema(t);

  it("successfully parses a valid position name", () => {
    const result = positionSchema.safeParse({ name: "Human Resources" });
    expect(result.success).toBe(true);
  });

  it("fails if the name is too short (less than 2 characters)", () => {
    const result = positionSchema.safeParse({ name: "A" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Name must be at least 2 characters");
    }
  });

  it("fails if the name is too long (more than 50 characters)", () => {
    const longName = "A".repeat(51);
    const result = positionSchema.safeParse({ name: longName });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Name is too long");
    }
  });

  it("fails if the name is missing or empty", () => {
    const result = positionSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Name must be at least 2 characters");
    }
  });
});