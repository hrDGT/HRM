import { useRouter } from "next/navigation";
import { renderHook } from "@testing-library/react";
import { toast } from "sonner";

import { useActionFeedback } from "@/hooks/auth/use-action-feedback";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
  },
}));

describe("useActionFeedback Hook", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it("does nothing if success is false or undefined", () => {
    renderHook(() => useActionFeedback(false, "Success!"));
    renderHook(() => useActionFeedback(undefined, "Success!"));

    expect(toast.success).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("calls toast.success when success is true, but does not redirect if no URL is provided", () => {
    renderHook(() => useActionFeedback(true, "Action completed successfully!"));

    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith("Action completed successfully!");

    expect(mockPush).not.toHaveBeenCalled();
  });

  it("calls toast.success and redirects when success is true and redirectUrl is provided", () => {
    renderHook(() => useActionFeedback(true, "Welcome back!", "/dashboard"));

    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith("Welcome back!");

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });

  it("handles state updates correctly (from false to true)", () => {
    const { rerender } = renderHook(
      ({ isSuccess }) => useActionFeedback(isSuccess, "Updated!", "/home"),
      { initialProps: { isSuccess: false } }
    );

    expect(toast.success).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();

    rerender({ isSuccess: true });

    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/home");
  });
});