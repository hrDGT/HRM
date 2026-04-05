import { renderHook, act, waitFor } from "@testing-library/react";
import { useResetPasswordForm } from "@/hooks/auth/use-reset-password-form";

describe("useResetPasswordForm Hook", () => {

  it("initializes with an empty default value for newPassword", () => {
    const { result } = renderHook(() => useResetPasswordForm());

    expect(result.current.form.getValues()).toEqual({ newPassword: "" });
  });

  it("fails validation when the newPassword is too short", async () => {
    const { result } = renderHook(() => useResetPasswordForm());

    const _ = result.current.form.formState.errors;

    act(() => {
      result.current.form.setValue("newPassword", "123");
    });

    await act(async () => {
      const isValid = await result.current.form.trigger();
      expect(isValid).toBe(false);
    });

    await waitFor(() => {
      expect(result.current.form.formState.errors.newPassword).toBeDefined();
      expect(result.current.form.formState.errors.newPassword?.message).toBe("Password must be at least 5 characters long");
    });
  });

  it("passes validation when a valid newPassword is provided", async () => {
    const { result } = renderHook(() => useResetPasswordForm());

    const _ = result.current.form.formState.errors;

    act(() => {
      result.current.form.setValue("newPassword", "SecurePassword123");
    });

    await act(async () => {
      const isValid = await result.current.form.trigger();
      expect(isValid).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.form.formState.errors.newPassword).toBeUndefined();
    });
  });
});