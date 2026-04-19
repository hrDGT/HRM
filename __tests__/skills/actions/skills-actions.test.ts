import { updateTag } from "next/cache";

import { createSkillAction } from "@/components/skills/actions/create-skills-action";
import { deleteSkillAction } from "@/components/skills/actions/delete-skills-action";
import { updateSkillAction } from "@/components/skills/actions/update-skills-action";
import { gqlRequestAuthed } from "@/lib/gql/graphql-client";

jest.mock("@/lib/utils", () => ({
  ...jest.requireActual("@/lib/utils"),
  getError: jest.fn((err, fallback) => fallback),
}));

jest.mock("next-intl/server", () => ({
  getTranslations: jest.fn(() =>
    Promise.resolve((key: string) => {
      const messages: Record<string, string> = {
        "createError": "Failed to create skill",
        "deleteError": "Failed to delete skill",
        "updateError": "Failed to update skill"
      };
      return messages[key] || key;
    })
  ),
}));

jest.mock("next/cache", () => ({ updateTag: jest.fn() }));
jest.mock("@/lib/gql/graphql-client", () => ({ gqlRequestAuthed: jest.fn() }));
jest.mock("@/gqlcodegen", () => ({ graphql: jest.fn((query) => query) }));

describe("Skills Server Actions", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("createSkillAction", () => {
    it("returns success on valid creation", async () => {
      (gqlRequestAuthed as jest.Mock).mockResolvedValue({ createSkill: { name: 'Test Skill', categoryId: '1' } });
      const result = await createSkillAction("Create test skill", '1');
      expect(result).toEqual({ success: true });
      expect(updateTag).toHaveBeenCalledWith("skills");
    });

    it("returns localized error on failure", async () => {
      (gqlRequestAuthed as jest.Mock).mockRejectedValue(new Error("GraphQL Error"));
      const result = await createSkillAction("Create test skill", '1');
      expect(result).toEqual({ error: "Failed to create skill" });
    });
  });

  describe("updateSkillAction", () => {
    it("returns success on valid update", async () => {
      (gqlRequestAuthed as jest.Mock).mockResolvedValue({ updateSkill: { skillId: "1", name: 'Update test skill', categoryId: '1' } });
      const result = await updateSkillAction("1", 'Update test skill', '1');
      expect(result).toEqual({ success: true });
      expect(updateTag).toHaveBeenCalledWith("skills");
    });

    it("returns localized error on update failure", async () => {
      (gqlRequestAuthed as jest.Mock).mockRejectedValue(new Error("Update Error"));
      const result = await updateSkillAction("1", 'Update test skill', '1');
      expect(result).toEqual({ error: "Failed to update skill" });
    });
  });

  describe("deleteSkillAction", () => {
    it("returns success on deletion", async () => {
      (gqlRequestAuthed as jest.Mock).mockResolvedValue({ deleteSkill: { skillId: '1' } });
      const result = await deleteSkillAction("1");
      expect(result).toEqual({ success: true });
      expect(updateTag).toHaveBeenCalledWith("skills");
    });

    it("returns localized error on deletion failure", async () => {
      (gqlRequestAuthed as jest.Mock).mockRejectedValue(new Error("Delete Error"));
      const result = await deleteSkillAction("1");
      expect(result).toEqual({ error: "Failed to delete skill" });
    });
  });
});