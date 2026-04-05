import { isUnauthorizedError } from "@/lib/gql/gql-utils";

describe("isUnauthorizedError Utility", () => {
  it("returns false if errors array is undefined", () => {
    expect(isUnauthorizedError(undefined)).toBe(false);
  });

  it("returns false if errors array is empty", () => {
    expect(isUnauthorizedError([])).toBe(false);
  });

  it("returns false if no error matches the unauthorized criteria", () => {
    const errors = [
      { message: "Internal Server Error" },
      { message: "Bad Request", extensions: { code: "BAD_USER_INPUT" } },
    ];

    expect(isUnauthorizedError(errors)).toBe(false);
  });

  it("returns true if at least one error has the message 'Unauthorized'", () => {
    const errors = [
      { message: "Some other error" },
      { message: "Unauthorized" },
    ];

    expect(isUnauthorizedError(errors)).toBe(true);
  });

  it("returns true if at least one error has extensions.code 'UNAUTHENTICATED'", () => {
    const errors = [
      {
        message: "Invalid token",
        extensions: { code: "UNAUTHENTICATED" }
      },
    ];

    expect(isUnauthorizedError(errors)).toBe(true);
  });

  it("returns true if both criteria are met in different errors", () => {
    const errors = [
      { message: "Unauthorized" },
      { message: "Expired", extensions: { code: "UNAUTHENTICATED" } },
    ];

    expect(isUnauthorizedError(errors)).toBe(true);
  });
});