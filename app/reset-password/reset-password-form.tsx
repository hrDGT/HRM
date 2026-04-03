"use client";

import { useActionFeedback } from "@/hooks/auth/use-action-feedback";
import { useResetPasswordForm } from "@/hooks/auth/use-reset-password-form";
import { ControlledPasswordInput } from "@/components/forms/controlled-password-input";
import { Form } from "@/components/forms/form";
import { FormActions } from "@/components/forms/form-actions";
import { FormHeader } from "@/components/forms/form-header";
import { Card, CardContent } from "@/components/ui/card";
import { FormRootError } from "@/components/ui/form-root-error";
import { ActionState, resetPasswordAction } from "@/lib/auth/auth-actions";
import { ResetPasswordValue } from "@/lib/schemas/auth";
import { useSearchParams } from "next/navigation";
import { startTransition, useActionState } from "react";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const resetPasswordActionWithToken = resetPasswordAction.bind(null, token);

  const [state, formAction, isPending] = useActionState<
    ActionState,
    ResetPasswordValue
  >(resetPasswordActionWithToken, null);

  const { form } = useResetPasswordForm();

  useActionFeedback(state?.success, "Password has been reset", "/auth/login");

  const handleFormSubmit = (values: ResetPasswordValue) => {
    startTransition(() => {
      formAction(values);
    });
  };

  return (
    <div className="min-h-screen flex justify-center items-center container mx-auto animate-in fade-in zoom-in-90 slide-in-from-bottom-6 duration-500">
      <Card className="w-full sm:max-w-xl">
        <FormHeader
          title="Set a new password"
          description="Almost done! Now create a new password"
        />
        <CardContent className="xl:mb-14">
          <Form
            id="reset-password-form"
            onSubmit={handleFormSubmit}
            form={form}
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
          formId="reset-password-form"
          buttonText="Submit"
          linkText="Back to log in"
          linkHref="/auth/login"
          isPending={isPending}
        />
      </Card>
    </div>
  );
}
