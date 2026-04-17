import { updateTag } from "next/cache";

import { createPositionAction } from "@/components/positions/actions/create-positions-action";
import { deletePositionAction } from "@/components/positions/actions/delete-positions-action";
import { updatePositionAction } from "@/components/positions/actions/update-positions-action";
import { gqlRequestAuthed } from "@/lib/gql/graphql-client";

jest.mock("@/lib/utils", () => ({
  ...jest.requireActual("@/lib/utils"),
  getError: jest.fn((err, fallback) => fallback),
}));

jest.mock("next-intl/server", () => ({
  getTranslations: jest.fn(() =>
    Promise.resolve((key: string) => {
      const messages: Record<string, string> = {
        "createError": "Failed to create position",
        "deleteError": "Failed to delete position",
        "updateError": "Failed to update position"
      };
      return messages[key] || key;
    })
  ),
}));

jest.mock("next/cache", () => ({ updateTag: jest.fn() }));
jest.mock("@/lib/gql/graphql-client", () => ({ gqlRequestAuthed: jest.fn() }));
jest.mock("@/gqlcodegen", () => ({ graphql: jest.fn((query) => query) }));

describe("Positions Server Actions", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("createPositionAction", () => {
    it("returns success on valid creation", async () => {
      (gqlRequestAuthed as jest.Mock).mockResolvedValue({ createPosition: { id: "1" } });
      const result = await createPositionAction("Create test pos");
      expect(result).toEqual({ success: true });
      expect(updateTag).toHaveBeenCalledWith("positions");
    });

    it("returns localized error on failure", async () => {
      (gqlRequestAuthed as jest.Mock).mockRejectedValue(new Error("GraphQL Error"));
      const result = await createPositionAction("Create test pos");
      expect(result).toEqual({ error: "Failed to create position" });
    });
  });

  describe("updatePositionAction", () => {
    it("returns success on valid update", async () => {
      (gqlRequestAuthed as jest.Mock).mockResolvedValue({ updatePosition: { id: "1" } });
      const result = await updatePositionAction("1", "Update test pos");
      expect(result).toEqual({ success: true });
      expect(updateTag).toHaveBeenCalledWith("positions");
    });

    it("returns localized error on update failure", async () => {
      (gqlRequestAuthed as jest.Mock).mockRejectedValue(new Error("Update Error"));
      const result = await updatePositionAction("1", "Update test pos");
      expect(result).toEqual({ error: "Failed to update position" });
    });
  });

  describe("deletePositionAction", () => {
    it("returns success on deletion", async () => {
      (gqlRequestAuthed as jest.Mock).mockResolvedValue({ deletePosition: { affected: 1 } });
      const result = await deletePositionAction("1");
      expect(result).toEqual({ success: true });
    });

    it("returns localized error on deletion failure", async () => {
      (gqlRequestAuthed as jest.Mock).mockRejectedValue(new Error("Delete Error"));
      const result = await deletePositionAction("1");
      expect(result).toEqual({ error: "Failed to delete position" });
    });
  });
});