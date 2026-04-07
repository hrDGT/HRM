"use client";

import { startTransition, useActionState, useId } from "react";

import { Form } from "@/components/forms/form";
import { FormActions } from "@/components/forms/form-actions";
import { FormHeader } from "@/components/forms/form-header";
import { ControlledInput } from "@/components/forms/form-input";
import { Card, CardContent } from "@/components/ui/card";
import { useActionFeedback } from "@/hooks/auth/use-action-feedback";

import { FormRootError } from "../auth-root-error";

import { forgotPasswordAction } from "./forgot-password-action";
import {
  forgotPasswordSchema,
  ForgotPasswordValues,
} from "./forgot-password-schema";

export function ForgotPasswordForm() {
  const id = useId();
  const [state, formAction, isPending] = useActionState(
    forgotPasswordAction,
    null,
  );

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
        <Form
          className="space-y-2"
          id={id}
          schema={forgotPasswordSchema}
          defaultValues={{ email: "" }}
          onSubmit={handleFormSubmit}
        >
          <ControlledInput name="email" placeholder="Email" autoFocus />
          <FormRootError message={state?.error} />
        </Form>
      </CardContent>
      <FormActions
        formId={id}
        buttonText="Reset password"
        linkText="Cancel"
        linkHref="/auth/login"
        isPending={isPending}
      />
    </Card>
  );
}
