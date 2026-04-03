"use client";

import { useLoginForm } from "@/hooks/auth/use-login-form";
import { ControlledInput } from "@/components/forms/controlled-input";
import { ControlledPasswordInput } from "@/components/forms/controlled-password-input";
import { Form } from "@/components/forms/form";
import { FormActions } from "@/components/forms/form-actions";
import { FormHeader } from "@/components/forms/form-header";
import { Card, CardContent } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { FormRootError } from "@/components/ui/form-root-error";
import { ActionState, loginUserAction } from "@/lib/auth/auth-actions";
import { type LoginFormValues } from "@/lib/schemas/auth";
import { startTransition, useActionState } from "react";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState<
    ActionState,
    LoginFormValues
  >(loginUserAction, null);

  const { form } = useLoginForm();

  const handleFormSubmit = (values: LoginFormValues) => {
    startTransition(() => {
      formAction(values);
    });
  };

  return (
    <Card>
      <FormHeader
        title="Welcome back"
        description="Hello again! Log in to continue"
      />
      <CardContent className="mb-14">
        <Form id="login-form" onSubmit={handleFormSubmit} form={form}>
          <FieldGroup className="gap-y-4">
            <ControlledInput name="email" placeholder="Email" autoFocus />
            <ControlledPasswordInput
              name="password"
              placeholder="Password"
              autoComplete="current-password"
            />
          </FieldGroup>
          <FormRootError message={state?.error} />
        </Form>
      </CardContent>
      <FormActions
        formId="login-form"
        buttonText="Log in"
        linkText="Forgot password"
        linkHref="/forgot-password"
        isPending={isPending}
      />
    </Card>
  );
}
