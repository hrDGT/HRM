"use client";

import { useActionFeedback } from "@/hooks/auth/use-action-feedback";
import { ControlledPasswordInput } from "@/components/forms/controlled-password-input";
import { Form } from "@/components/forms/form";
import { FormActions } from "@/components/forms/form-actions";
import { FormHeader } from "@/components/forms/form-header";
import { Card, CardContent } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { startTransition, useActionState, useId } from "react";
import {
  resetPasswordSchema,
  ResetPasswordValue,
} from "./reset-password-schema";
import { FormRootError } from "../auth-root-error";
import { ActionState } from "@/lib/auth/auth-types";
import { resetPasswordAction } from "./reset-password-action";

export function ResetPasswordForm() {
  const id = useId();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const actionWrapper = async (
    state: ActionState,
    data: ResetPasswordValue,
  ) => {
    return resetPasswordAction(token, state, data);
  };

  const [state, formAction, isPending] = useActionState(actionWrapper, null);

  const handleFormSubmit = (data: ResetPasswordValue) => {
    startTransition(() => {
      formAction(data);
    });
  };

  useActionFeedback(state?.success, "Password has been reset", "/auth/login");

  return (
    <Card className="w-full max-w-xl">
      <FormHeader
        title="Set a new password"
        description="Almost done! Now create a new password"
      />
      <CardContent className="mb-14">
        <Form
          className="space-y-2"
          id={id}
          schema={resetPasswordSchema}
          defaultValues={{ newPassword: "" }}
          onSubmit={handleFormSubmit}
        >
          <ControlledPasswordInput
            name="newPassword"
            placeholder="Password"
            autoComplete="new-password"
            autoFocus
            hasProtectIcon={false}
          />
          <FormRootError message={state?.error} />
        </Form>
      </CardContent>
      <FormActions
        formId={id}
        buttonText="Submit"
        linkText="Back to log in"
        linkHref="/auth/login"
        isPending={isPending}
      />
    </Card>
  );
}
