import { type LoginFormValues, loginSchema, } from '@/lib/schemas/auth';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function useLoginForm() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  return { form };
}