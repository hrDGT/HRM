import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupFormValues, signupSchema } from "@/lib/schemas/auth";

export function useSignUpForm() {
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: SignupFormValues) => {
    console.log("Отправка на сервер:", data);
  };

  return { form, onSubmit };
}