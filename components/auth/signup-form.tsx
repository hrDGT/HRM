"use client";

import { useActionState, startTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { Form } from "@/components/forms/form";
import { ControlledInput } from "@/components/forms/controlled-input";
import { ControlledPasswordInput } from "@/components/forms/controlled-password-input";
import { useSignUpForm } from "@/hooks/auth/use-signup-form";
import { FormHeader } from "@/components/forms/form-header";
import { FormActions } from "@/components/forms/form-actions";
import { FormRootError } from "@/components/ui/form-root-error";
import { type SignupFormValues } from "@/lib/schemas/auth";
import { type ActionState, signUpUserAction } from "@/lib/auth/auth-actions";

export default function SignupForm() {
  const [state, formAction, isPending] = useActionState<
    ActionState,
    SignupFormValues
  >(signUpUserAction, null);

  const { form } = useSignUpForm();

  const handleFormSubmit = (values: SignupFormValues) => {
    startTransition(() => {
      formAction(values);
    });
  };

  return (
    <Card>
      <FormHeader
        title="Register now"
        description="Welcome! Sign up to continue"
      />
      <CardContent className="mb-14">
        <Form id="signup-form" onSubmit={handleFormSubmit} form={form}>
          <FieldGroup className="gap-y-4">
            <ControlledInput name="email" placeholder="Email" autoFocus />
            <ControlledPasswordInput
              name="password"
              placeholder="Password"
              autoComplete="new-password"
            />
          </FieldGroup>
          <FormRootError message={state?.error} />
        </Form>
      </CardContent>
      <FormActions
        formId="signup-form"
        buttonText="Create account"
        linkText="I have an account"
        linkHref="/auth/login"
        isPending={isPending}
      />
    </Card>
  );
}
