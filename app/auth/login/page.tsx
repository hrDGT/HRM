"use client";

import { useLoginForm } from "@/app/hooks/auth/use-login-form";
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

export default function LoginPage() {
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
    <div className="min-h-screen flex justify-center items-center container mx-auto animate-in fade-in zoom-in-90 slide-in-from-bottom-6 duration-500">
      <Card className="w-full sm:max-w-xl">
        <FormHeader
          title="Welcome back"
          description="Hello again! Log in to continue"
        />
        <CardContent className="xl:mb-14">
          <Form id="signup-form" onSubmit={handleFormSubmit} form={form}>
            <FieldGroup className="gap-y-4">
              <ControlledInput name="email" placeholder="Email" autoFocus />
              <ControlledPasswordInput name="password" placeholder="Password" />
            </FieldGroup>
            <FormRootError message={state?.error} />
          </Form>
        </CardContent>
        <FormActions
          formId="signup-form"
          buttonText="Log in"
          linkText="Forgot password"
          linkHref="#"
          isPending={isPending}
        />
      </Card>
    </div>
  );
}
