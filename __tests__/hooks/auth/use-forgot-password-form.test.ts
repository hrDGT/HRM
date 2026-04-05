import { renderHook, act, waitFor } from "@testing-library/react";
import { useForgotPasswordForm } from "@/hooks/auth/use-forgot-password-form";

describe("useForgotPasswordForm Hook", () => {
  it("initializes with an empty email default value", () => {
    const { result } = renderHook(() => useForgotPasswordForm());

    expect(result.current.form.getValues()).toEqual({ email: "" });
  });

  it("fails validation and sets an error when the email is invalid", async () => {
    const { result } = renderHook(() => useForgotPasswordForm());

    const _ = result.current.form.formState.errors;

    act(() => {
      result.current.form.setValue("email", "not-an-email");
    });

    await act(async () => {
      const isValid = await result.current.form.trigger("email");
      expect(isValid).toBe(false);
    });

    await waitFor(() => {
      expect(result.current.form.formState.errors.email).toBeDefined();
      expect(result.current.form.formState.errors.email?.message).toBe("Invalid email");
    });
  });

  it("passes validation when a valid email is provided", async () => {
    const { result } = renderHook(() => useForgotPasswordForm());

    act(() => {
      result.current.form.setValue("email", "test@example.com");
    });

    await act(async () => {
      const isValid = await result.current.form.trigger("email");
      expect(isValid).toBe(true);
    });

    expect(result.current.form.formState.errors.email).toBeUndefined();
  });
});