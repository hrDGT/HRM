import { signupSchema, type SignupFormValues } from '@/lib/schemas/auth';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignupMutation } from "./use-signup-mutation";
import { useRouter } from "next/navigation";
import { authStorage } from '@/lib/auth/auth';
import { handleAuthError } from '@/lib/auth/auth-errors';

export function useSignUpForm() {
  const router = useRouter();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "" },
  });

  const [signup, { loading }] = useSignupMutation();

  const onSubmit = async (values: SignupFormValues) => {
    try {
      const { data } = await signup({
        variables: { auth: values },
      });

      const token = data?.signup?.access_token;

      if (token) {
        authStorage.setToken(token);
        router.push("/");
      }
    } catch (err) {
      handleAuthError(err, form.setError);
    }
  };

  return {
    form,
    onSubmit,
    isPending: loading,
    rootError: form.formState.errors.root?.message,
  };
}
