import { UseFormSetError, FieldValues, Path } from "react-hook-form";

export const handleAuthError = <T extends FieldValues>(
  err: unknown,
  setError: UseFormSetError<T>
) => {
  const message = err instanceof Error ? err.message : String(err);

  if (message.includes("User already exists")) {
    return setError("email" as Path<T>, { message: "User already exists" });
  }

  setError("root" as Path<T>, { message: "Server error" });
};