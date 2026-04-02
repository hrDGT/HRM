import { signupSchema, type SignupFormValues } from '@/lib/schemas/auth';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function useSignUpForm() {
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "" },
  });

  return { form };
}