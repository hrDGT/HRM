"use client";

import { useForgotPasswordForm } from "@/hooks/auth/use-forgot-password-form";
import { useActionFeedback } from "@/hooks/auth/use-action-feedback";
import { ControlledInput } from "@/components/forms/controlled-input";
import { Form } from "@/components/forms/form";
import { FormActions } from "@/components/forms/form-actions";
import { FormHeader } from "@/components/forms/form-header";
import { Card, CardContent } from "@/components/ui/card";
import { FormRootError } from "./form-root-error";
import {
  type ActionState,
  forgotPasswordAction,
} from "@/lib/auth/auth-actions";
import { ForgotPasswordValues } from "@/lib/schemas/auth";
import { startTransition, useActionState } from "react";

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState<
    ActionState,
    ForgotPasswordValues
  >(forgotPasswordAction, null);

  const { form } = useForgotPasswordForm();

  useActionFeedback(state?.success, "Check your email inbox", "/auth/login");

  const handleFormSubmit = (values: ForgotPasswordValues) => {
    startTransition(() => {
      formAction(values);
    });
  };

  return (
    <Card className="w-full max-w-xl">
      <FormHeader
        title="Forgot password"
        description="We will sent you an email with further instructions"
      />
      <CardContent className="mb-14">
        <Form id="forgot-password-form" onSubmit={handleFormSubmit} form={form}>
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
  );
}
