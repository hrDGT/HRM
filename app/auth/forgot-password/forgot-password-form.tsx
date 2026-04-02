"use client";

import { useForgotPasswordForm } from "@/app/hooks/auth/use-forgot-password-form";
import { ControlledInput } from "@/components/forms/controlled-input";
import { Form } from "@/components/forms/form";
import { FormActions } from "@/components/forms/form-actions";
import { FormHeader } from "@/components/forms/form-header";
import { Card, CardContent } from "@/components/ui/card";
import { FormRootError } from "@/components/ui/form-root-error";
import {
  type ActionState,
  forgotPasswordAction,
} from "@/lib/auth/auth-actions";
import { ForgotPasswordValues } from "@/lib/schemas/auth";
import { startTransition, useActionState } from "react";

export default function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState<
    ActionState,
    ForgotPasswordValues
  >(forgotPasswordAction, null);

  const { form } = useForgotPasswordForm();

  const handleFormSubmit = (values: ForgotPasswordValues) => {
    startTransition(() => {
      formAction(values);
    });
  };

  return (
    <div className="min-h-screen flex justify-center items-center container mx-auto animate-in fade-in zoom-in-90 slide-in-from-bottom-6 duration-500">
      <Card className="w-full sm:max-w-xl">
        <FormHeader
          title="Forgot password"
          description="We will sent you an email with further instructions"
        />
        <CardContent className="xl:mb-14">
          <Form
            id="forgot-password-form"
            onSubmit={handleFormSubmit}
            form={form}
          >
            <ControlledInput name="email" placeholder="Email" autoFocus />
            <FormRootError message={state?.error} />
          </Form>
        </CardContent>
        <FormActions
          formId="forgot-password-form"
          buttonText="Reset password"
          linkText="Cancel"
          linkHref="/auth/login"
          isPending={isPending}
        />
      </Card>
    </div>
  );
}
