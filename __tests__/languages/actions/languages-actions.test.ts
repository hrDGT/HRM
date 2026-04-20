import { updateTag } from "next/cache";

import { createLanguageAction } from "@/components/languages/actions/create-languages-action";
import { deleteLanguageAction } from "@/components/languages/actions/delete-languages-action";
import { updateLanguageAction } from "@/components/languages/actions/update-languages-action";
import { gqlRequestAuthed } from "@/lib/gql/graphql-client";

jest.mock("@/lib/utils", () => ({
  ...jest.requireActual("@/lib/utils"),
  getError: jest.fn((err, fallback) => fallback),
}));

jest.mock("next-intl/server", () => ({
  getTranslations: jest.fn(() =>
    Promise.resolve((key: string) => {
      const messages: Record<string, string> = {
        "createError": "Failed to create language",
        "deleteError": "Failed to delete language",
        "updateError": "Failed to update language"
      };
      return messages[key] || key;
    })
  ),
}));

jest.mock("next/cache", () => ({ updateTag: jest.fn() }));
jest.mock("@/lib/gql/graphql-client", () => ({ gqlRequestAuthed: jest.fn() }));
jest.mock("@/gqlcodegen", () => ({ graphql: jest.fn((query) => query) }));

describe("Languages Server Actions", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("createLanguageAction", () => {
    it("returns success on valid creation", async () => {
      (gqlRequestAuthed as jest.Mock).mockResolvedValue({
        createLanguage: { id: "1", name: 'Test name lang', iso2: 'TE', native_name: 'Test native name lang' }
      });
      const result = await createLanguageAction("Create test lang", 'TE', 'test');
      expect(result).toEqual({ success: true });
      expect(updateTag).toHaveBeenCalledWith("languages");
    });

    it("returns localized error on failure", async () => {
      (gqlRequestAuthed as jest.Mock).mockRejectedValue(new Error("GraphQL Error"));
      const result = await createLanguageAction("Create test lang", 'TE', 'test');
      expect(result).toEqual({ error: "Failed to create language" });
    });
  });

  describe("updateLanguageAction", () => {
    it("returns success on valid update", async () => {
      (gqlRequestAuthed as jest.Mock).mockResolvedValue({
        updateLanguage: { id: "1", name: "Update test lang", iso2: 'TE', native_name: 'test' }
      });
      const result = await updateLanguageAction("1", "Update test lang", 'TE', 'test');
      expect(result).toEqual({ success: true });
      expect(updateTag).toHaveBeenCalledWith("languages");
    });

    it("returns localized error on update failure", async () => {
      (gqlRequestAuthed as jest.Mock).mockRejectedValue(new Error("Update Error"));
      const result = await updateLanguageAction("1", "Update test lang", 'TE', 'test');
      expect(result).toEqual({ error: "Failed to update language" });
    });
  });

  describe("deleteLanguageAction", () => {
    it("returns success on deletion", async () => {
      (gqlRequestAuthed as jest.Mock).mockResolvedValue({ deleteLanguage: { affected: 1 } });
      const result = await deleteLanguageAction("1");
      expect(result).toEqual({ success: true });
      expect(updateTag).toHaveBeenCalledWith("languages");
    });

    it("returns localized error on deletion failure", async () => {
      (gqlRequestAuthed as jest.Mock).mockRejectedValue(new Error("Delete Error"));
      const result = await deleteLanguageAction("1");
      expect(result).toEqual({ error: "Failed to delete language" });
    });
  });
});