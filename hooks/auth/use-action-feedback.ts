import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useActionFeedback(
  success: boolean | undefined,
  successMessage: string,
  redirectUrl?: string
) {
  const router = useRouter();

  useEffect(() => {
    if (success) {
      toast.success(successMessage);
      if (redirectUrl) {
        router.push(redirectUrl);
      }
    }
  }, [success, successMessage, redirectUrl, router]);
}