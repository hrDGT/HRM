import { updateTag } from "next/cache";

import { createDepartmentAction } from "@/components/departments/actions/create-departments-action";
import { deleteDepartmentAction } from "@/components/departments/actions/delete-departments-action";
import { updateDepartmentAction } from "@/components/departments/actions/update-departments-action";
import { gqlRequestAuthed } from "@/lib/gql/graphql-client";

jest.mock("@/lib/utils", () => ({
  ...jest.requireActual("@/lib/utils"),
  getError: jest.fn((err, fallback) => fallback),
}));

jest.mock("next-intl/server", () => ({
  getTranslations: jest.fn(() =>
    Promise.resolve((key: string) => {
      const messages: Record<string, string> = {
        "createError": "Failed to create department",
        "deleteError": "Failed to delete department",
        "updateError": "Failed to update department"
      };
      return messages[key] || key;
    })
  ),
}));

jest.mock("next/cache", () => ({ updateTag: jest.fn() }));
jest.mock("@/lib/gql/graphql-client", () => ({ gqlRequestAuthed: jest.fn() }));
jest.mock("@/gqlcodegen", () => ({ graphql: jest.fn((query) => query) }));

describe("Departments Server Actions", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("createDepartmentAction", () => {
    it("returns success on valid creation", async () => {
      (gqlRequestAuthed as jest.Mock).mockResolvedValue({ createDepartment: { id: "1" } });
      const result = await createDepartmentAction("Create test dep");
      expect(result).toEqual({ success: true });
      expect(updateTag).toHaveBeenCalledWith("departments");
    });

    it("returns localized error on failure", async () => {
      (gqlRequestAuthed as jest.Mock).mockRejectedValue(new Error("GraphQL Error"));
      const result = await createDepartmentAction("Create test dep");
      expect(result).toEqual({ error: "Failed to create department" });
    });
  });

  describe("updateDepartmentAction", () => {
    it("returns success on valid update", async () => {
      (gqlRequestAuthed as jest.Mock).mockResolvedValue({ updateDepartment: { id: "1" } });
      const result = await updateDepartmentAction("1", "Update test dep");
      expect(result).toEqual({ success: true });
      expect(updateTag).toHaveBeenCalledWith("departments");
    });

    it("returns localized error on update failure", async () => {
      (gqlRequestAuthed as jest.Mock).mockRejectedValue(new Error("Update Error"));
      const result = await updateDepartmentAction("1", "Update test dep");
      expect(result).toEqual({ error: "Failed to update department" });
    });
  });

  describe("deleteDepartmentAction", () => {
    it("returns success on deletion", async () => {
      (gqlRequestAuthed as jest.Mock).mockResolvedValue({ deleteDepartment: { affected: 1 } });
      const result = await deleteDepartmentAction("1");
      expect(result).toEqual({ success: true });
    });

    it("returns localized error on deletion failure", async () => {
      (gqlRequestAuthed as jest.Mock).mockRejectedValue(new Error("Delete Error"));
      const result = await deleteDepartmentAction("1");
      expect(result).toEqual({ error: "Failed to delete department" });
    });
  });
});