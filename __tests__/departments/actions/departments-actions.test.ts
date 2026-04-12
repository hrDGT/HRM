import { revalidatePath } from "next/cache";

import { createDepartmentAction } from "@/components/departments/actions/create-departments-action";
import { deleteDepartmentAction } from "@/components/departments/actions/delete-departments-action";
import { fetchDepartments } from "@/components/departments/actions/get-departments-action";
import { updateDepartmentAction } from "@/components/departments/actions/update-departments-action";
import { gqlRequestAuthed } from "@/lib/gql/graphql-client";

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.mock("@/lib/gql/graphql-client", () => ({
  gqlRequestAuthed: jest.fn(),
}));

jest.mock("@/gqlcodegen", () => ({
  graphql: jest.fn((query) => query),
}));

describe("Departments Server Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchDepartments", () => {
    it("fetches and returns departments", async () => {
      const mockDepartments = [{ id: "1", name: "HR" }];
      (gqlRequestAuthed as jest.Mock).mockResolvedValue({ departments: mockDepartments });

      const result = await fetchDepartments();

      expect(gqlRequestAuthed).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockDepartments);
    });
  });

  describe("createDepartmentAction", () => {
    it("creates a department and revalidates path on success", async () => {
      (gqlRequestAuthed as jest.Mock).mockResolvedValue({ createDepartment: { id: "2", name: "IT" } });

      const result = await createDepartmentAction("IT");

      expect(gqlRequestAuthed).toHaveBeenCalledWith(expect.anything(), { department: { name: "IT" } });
      expect(revalidatePath).toHaveBeenCalledWith("/departments");
      expect(result).toEqual({ success: true });
    });

    it("returns an error if creation fails", async () => {
      (gqlRequestAuthed as jest.Mock).mockRejectedValue(new Error("Network Error"));

      const result = await createDepartmentAction("IT");

      expect(revalidatePath).not.toHaveBeenCalled();
      expect(result).toEqual({ error: "Network Error" });
    });
  });

  describe("updateDepartmentAction", () => {
    it("updates a department and revalidates path on success", async () => {
      (gqlRequestAuthed as jest.Mock).mockResolvedValue({ updateDepartment: { id: "1", name: "Sales" } });

      const result = await updateDepartmentAction("1", "Sales");

      expect(gqlRequestAuthed).toHaveBeenCalledWith(expect.anything(), { department: { departmentId: "1", name: "Sales" } });
      expect(revalidatePath).toHaveBeenCalledWith("/departments");
      expect(result).toEqual({ success: true });
    });
  });

  describe("deleteDepartmentAction", () => {
    it("deletes a department and revalidates path on success", async () => {
      (gqlRequestAuthed as jest.Mock).mockResolvedValue({ deleteDepartment: { affected: 1 } });

      const result = await deleteDepartmentAction("1");

      expect(gqlRequestAuthed).toHaveBeenCalledWith(expect.anything(), { department: { departmentId: "1" } });
      expect(revalidatePath).toHaveBeenCalledWith("/departments");
      expect(result).toEqual({ success: true });
    });
  });
});