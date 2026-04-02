import { resetPasswordSchema, ResetPasswordValue } from "@/lib/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export function useForgotPasswordForm() {
  const form = useForm<ResetPasswordValue>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: '' }
  })

  return { form }
}