import { getLanguagesSchema } from "@/components/languages/schemas/languages-schema";

describe("Languages Zod Schema", () => {
  const t = (key: string) => {
    const messages: Record<string, string> = {
      "validation.nameMin": "Name must be at least 2 characters",
      "validation.nameMax": "Name is too long",
      "validation.onlyLetters": "You can use only letters",
      "validation.isoLength": "ISO2 must be 2 letters",
    };
    return messages[key] || key;
  };

  const languagesSchema = getLanguagesSchema(t);

  it("successfully parses a valid language with all fields", () => {
    const result = languagesSchema.safeParse({
      name: "English",
      iso2: "EN",
      native_name: "English",
    });
    expect(result.success).toBe(true);
  });

  it("successfully parses a valid language with empty native_name", () => {
    const result = languagesSchema.safeParse({
      name: "English",
      iso2: "EN",
      native_name: "", 
    });
    expect(result.success).toBe(true);
  });


  it("fails if the name is too short", () => {
    const result = languagesSchema.safeParse({ name: "A", iso2: "EN" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Name must be at least 2 characters");
    }
  });

  it("fails if the name is too long", () => {
    const longName = "A".repeat(21);
    const result = languagesSchema.safeParse({ name: longName, iso2: "EN" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Name is too long");
    }
  });

  it("fails if the name contains numbers or special characters", () => {
    const result = languagesSchema.safeParse({ name: "English123", iso2: "EN" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("You can use only letters");
    }
  });


  it("fails if iso2 is too long or too short", () => {
    let result = languagesSchema.safeParse({ name: "English", iso2: "ENG" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("ISO2 must be 2 letters");
    }

    result = languagesSchema.safeParse({ name: "English", iso2: "E" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("ISO2 must be 2 letters");
    }
  });

  it("fails if iso2 contains numbers", () => {
    const result = languagesSchema.safeParse({ name: "English", iso2: "E1" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("You can use only letters");
    }
  });


  it("fails if native_name is too long", () => {
    const longNativeName = "A".repeat(21);
    const result = languagesSchema.safeParse({
      name: "English",
      iso2: "EN",
      native_name: longNativeName
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Name is too long");
    }
  });
});