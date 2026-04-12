"use client";

import { startTransition, useActionState, useId } from "react";

import { useActionFeedback } from "@/components/auth/hooks/use-action-feedback";
import { Form } from "@/components/forms/ui/form";
import { FormActions } from "@/components/forms/ui/form-actions";
import { FormHeader } from "@/components/forms/ui/form-header";
import { FormInput } from "@/components/forms/ui/form-input";
import { Card, CardContent } from "@/components/ui/card";

import { forgotPasswordAction } from "../actions/forgot-password-action";
import {
  forgotPasswordSchema,
  ForgotPasswordValues,
} from "../schemas/forgot-password-schema";

import { FormRootError } from "./auth-root-error";

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
          <FormInput
            name="email"
            placeholder="Email"
            autoFocus
            autocompleteValue="email"
          />
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
