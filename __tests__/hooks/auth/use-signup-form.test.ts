import { renderHook, act, waitFor } from "@testing-library/react";
import { useSignUpForm } from "@/hooks/auth/use-signup-form";

describe("useSignUpForm Hook", () => {

  it("initializes with empty default values for email and password", () => {
    const { result } = renderHook(() => useSignUpForm());

    expect(result.current.form.getValues()).toEqual({ email: "", password: "" });
  });

  it("fails validation when the email is invalid", async () => {
    const { result } = renderHook(() => useSignUpForm());

    const _ = result.current.form.formState.errors;

    act(() => {
      result.current.form.setValue("email", "not-an-email");
      result.current.form.setValue("password", "ValidPassword123");
    });

    await act(async () => {
      const isValid = await result.current.form.trigger();
      expect(isValid).toBe(false);
    });

    await waitFor(() => {
      expect(result.current.form.formState.errors.email).toBeDefined();
      expect(result.current.form.formState.errors.email?.message).toBe("Invalid email");
      expect(result.current.form.formState.errors.password).toBeUndefined();
    });
  });

  it("fails validation when the password is too short", async () => {
    const { result } = renderHook(() => useSignUpForm());

    const _ = result.current.form.formState.errors;

    act(() => {
      result.current.form.setValue("email", "test@example.com");
      result.current.form.setValue("password", "123");
    });

    await act(async () => {
      const isValid = await result.current.form.trigger();
      expect(isValid).toBe(false);
    });

    await waitFor(() => {
      expect(result.current.form.formState.errors.password).toBeDefined();
      expect(result.current.form.formState.errors.password?.message).toBe("Password must be at least 5 characters long");
      expect(result.current.form.formState.errors.email).toBeUndefined();
    });
  });

  it("passes validation when both email and password are valid", async () => {
    const { result } = renderHook(() => useSignUpForm());

    const _ = result.current.form.formState.errors;

    act(() => {
      result.current.form.setValue("email", "test@example.com");
      result.current.form.setValue("password", "SecurePassword123");
    });

    await act(async () => {
      const isValid = await result.current.form.trigger();
      expect(isValid).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.form.formState.errors.email).toBeUndefined();
      expect(result.current.form.formState.errors.password).toBeUndefined();
    });
  });
});